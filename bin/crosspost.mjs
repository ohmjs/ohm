#!/usr/bin/env node

/* eslint-disable no-console */
/* global process */

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createInterface} from 'node:readline/promises';
import {basename, resolve} from 'node:path';
import {Client, BlueskyStrategy, MastodonStrategy} from '@humanwhocodes/crosspost';
import * as p from '@clack/prompts';
import {parse, stringify} from 'yaml';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: crosspost.mjs [command] [dir]

Commands:
  post   Post all unpublished entries (default)
  add    Interactive TUI for managing posts

Dir defaults to ./.crosspost`);
  process.exit(0);
}
let command = 'post';
let dir = '.crosspost';

if (args.length > 0 && ['post', 'add'].includes(args[0])) {
  command = args[0];
  if (args[1]) dir = args[1];
} else if (args.length > 0) {
  dir = args[0];
}

const baseDir = resolve(dir);
const postsPath = resolve(baseDir, 'posts.yaml');

function loadPosts() {
  if (!existsSync(postsPath)) return [];
  const raw = readFileSync(postsPath, 'utf-8');
  const data = parse(raw);
  return Array.isArray(data) ? data : [];
}

function savePosts(posts) {
  mkdirSync(baseDir, {recursive: true});
  writeFileSync(postsPath, stringify(posts));
}

// --- post command ---

async function runPost() {
  const posts = loadPosts();
  if (posts.length === 0) {
    console.log('No posts found.');
    process.exit(0);
  }

  const allStrategies = [];

  if (process.env.BLUESKY_IDENTIFIER && process.env.BLUESKY_PASSWORD) {
    allStrategies.push(
      new BlueskyStrategy({
        identifier: process.env.BLUESKY_IDENTIFIER,
        password: process.env.BLUESKY_PASSWORD,
        host: process.env.BLUESKY_HOST || 'bsky.social',
      })
    );
  }

  if (process.env.MASTODON_ACCESS_TOKEN && process.env.MASTODON_HOST) {
    allStrategies.push(
      new MastodonStrategy({
        accessToken: process.env.MASTODON_ACCESS_TOKEN,
        host: process.env.MASTODON_HOST,
      })
    );
  }

  if (allStrategies.length === 0) {
    console.error('No services configured. Set env vars for Bluesky and/or Mastodon.');
    process.exit(1);
  }

  const serviceIds = allStrategies.map(s => s.id);

  function needsPosting(post) {
    if (!post.posted) return true;
    return serviceIds.some(id => !post.posted[id]);
  }

  const pending = posts.filter(needsPosting);
  if (pending.length === 0) {
    console.log('Nothing to post.');
    process.exit(0);
  }

  let modified = false;
  for (const post of pending) {
    const alreadyPosted = post.posted ?? {};
    const strategies = allStrategies.filter(s => !alreadyPosted[s.id]);
    const client = new Client({strategies});

    console.log(`Posting: ${post.message.slice(0, 60)}...`);
    try {
      const opts = {};
      if (post.image) {
        if (!existsSync(post.image)) {
          console.error(`  Image not found: ${post.image}`);
          continue;
        }
        opts.images = [
          {
            data: new Uint8Array(readFileSync(post.image)),
            alt: post.image_alt ?? basename(post.image),
          },
        ];
      }
      const results = await client.post(post.message, opts);
      if (!post.posted) post.posted = {};
      for (const result of results) {
        if (result.ok) {
          const id = result.name.toLowerCase();
          post.posted[id] = {url: result.url ?? null};
          console.log(`  ✓ ${result.name}: ${result.url ?? '(no url)'}`);
        } else {
          console.error(`  ✗ ${result.name}: ${result.reason.message}`);
        }
      }
      modified = true;
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  }

  if (modified) {
    savePosts(posts);
    console.log(`Updated ${postsPath}`);
  }
}

// --- add command (TUI) ---

function statusLabel(post) {
  if (!post.posted) return 'draft';
  const services = Object.keys(post.posted);
  return `posted → ${services.join(', ')}`;
}

function truncate(str, len = 60) {
  const oneLine = str.replace(/\n/g, ' ');
  return oneLine.length > len ? oneLine.slice(0, len) + '…' : oneLine;
}

function postLabel(post) {
  let label = truncate(post.message);
  if (post.image) label += ' 📎';
  return label;
}

async function readMultiline(prompt) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log(`${prompt} (Ctrl-D to finish)`);
  const lines = [];
  try {
    while (true) {
      const line = await rl.question('  │  ');
      lines.push(line);
    }
  } catch {
    // Ctrl-D closes the interface, causing question() to reject
  } finally {
    rl.close();
  }
  return lines.join('\n');
}

function unescapePath(str) {
  // Remove shell line continuations (\<newline>) and any stray newlines/carriage returns,
  // then unescape remaining backslash sequences (e.g. '\ ' -> ' ').
  return str
    .replace(/\\\r?\n/g, '')
    .replace(/[\r\n]/g, '')
    .replace(/\\(.)/g, '$1')
    .trim();
}

async function promptImage() {
  const addImage = await p.confirm({message: 'Attach an image?', initialValue: false});
  if (p.isCancel(addImage) || !addImage) return null;

  const rawImage = await p.text({
    message: 'Image path (absolute)',
    placeholder: '/path/to/photo.png',
    validate(value) {
      if (!value) return 'Path is required';
      console.log('raw:', JSON.stringify(value));
      const unescaped = unescapePath(value);
      console.log('unescaped:', JSON.stringify(unescaped));
      if (!existsSync(unescaped)) return `File not found: ${unescaped}`;
    },
  });
  if (p.isCancel(rawImage)) return null;
  const image = unescapePath(rawImage);

  const imageAlt = await p.text({
    message: 'Alt text',
    placeholder: basename(image),
  });
  if (p.isCancel(imageAlt)) return null;

  return {image, image_alt: imageAlt || basename(image)};
}

async function addPost(posts) {
  const message = await readMultiline(p.log.step('Compose your post') ?? '');
  if (!message) {
    p.log.warn('Empty message, skipping.');
    return;
  }

  const imageInfo = await promptImage();

  const preview = imageInfo
    ? `${message}\n\n📎 ${imageInfo.image} (${imageInfo.image_alt})`
    : message;
  p.note(preview, 'Preview');

  const ok = await p.confirm({message: 'Add this post?'});
  if (p.isCancel(ok) || !ok) {
    p.log.info('Discarded.');
    return;
  }

  const entry = {message};
  if (imageInfo) {
    entry.image = imageInfo.image;
    entry.image_alt = imageInfo.image_alt;
  }
  posts.push(entry);
  savePosts(posts);
  p.log.success('Post added.');
}

async function listPosts(posts) {
  if (posts.length === 0) {
    p.log.info('No posts yet.');
    return;
  }
  const summary = posts
    .map((post, i) => {
      const status = statusLabel(post);
      return `  ${i + 1}. [${status}] ${postLabel(post)}`;
    })
    .join('\n');
  p.note(summary, `${posts.length} post(s)`);
}

async function editPost(posts) {
  if (posts.length === 0) {
    p.log.info('No posts to edit.');
    return;
  }
  const drafts = posts.map((post, i) => ({post, i})).filter(({post}) => !post.posted);

  if (drafts.length === 0) {
    p.log.info('No draft posts to edit.');
    return;
  }

  const idx = await p.select({
    message: 'Which post to edit?',
    options: drafts.map(({post, i}) => ({
      value: i,
      label: postLabel(post),
    })),
  });
  if (p.isCancel(idx)) return;

  const message = await readMultiline(p.log.step('New message (replaces current)') ?? '');
  if (!message) {
    p.log.warn('Empty message, keeping original.');
    return;
  }

  const imageInfo = await promptImage();

  const preview = imageInfo
    ? `${message}\n\n📎 ${imageInfo.image} (${imageInfo.image_alt})`
    : message;
  p.note(preview, 'Preview');
  const ok = await p.confirm({message: 'Save changes?'});
  if (p.isCancel(ok) || !ok) return;

  posts[idx].message = message;
  if (imageInfo) {
    posts[idx].image = imageInfo.image;
    posts[idx].image_alt = imageInfo.image_alt;
  }
  savePosts(posts);
  p.log.success('Post updated.');
}

async function deletePost(posts) {
  if (posts.length === 0) {
    p.log.info('No posts to delete.');
    return;
  }
  const drafts = posts.map((post, i) => ({post, i})).filter(({post}) => !post.posted);

  if (drafts.length === 0) {
    p.log.info('No draft posts to delete.');
    return;
  }

  const idx = await p.select({
    message: 'Which post to delete?',
    options: drafts.map(({post, i}) => ({
      value: i,
      label: postLabel(post),
    })),
  });
  if (p.isCancel(idx)) return;

  p.note(posts[idx].message, 'This post will be deleted');
  const ok = await p.confirm({message: 'Are you sure?'});
  if (p.isCancel(ok) || !ok) return;

  posts.splice(idx, 1);
  savePosts(posts);
  p.log.success('Post deleted.');
}

async function runAdd() {
  p.intro('crosspost — manage posts');
  const posts = loadPosts();

  while (true) {
    const drafts = posts.filter(p => !p.posted).length;
    const posted = posts.length - drafts;

    const action = await p.select({
      message: `${posts.length} post(s): ${drafts} draft, ${posted} posted`,
      options: [
        {value: 'add', label: 'Add a new post'},
        {value: 'list', label: 'List all posts'},
        {value: 'edit', label: 'Edit a draft'},
        {value: 'delete', label: 'Delete a draft'},
        {value: 'quit', label: 'Quit'},
      ],
    });

    if (p.isCancel(action) || action === 'quit') {
      p.outro('Done.');
      break;
    }

    if (action === 'add') await addPost(posts);
    else if (action === 'list') await listPosts(posts);
    else if (action === 'edit') await editPost(posts);
    else if (action === 'delete') await deletePost(posts);
  }
}

// --- main ---

if (command === 'add') {
  runAdd();
} else {
  runPost();
}
