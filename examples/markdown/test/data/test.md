# Introduction to Filament, a Humanist Language

Filament is a [humanist](https://en.wikipedia.org/wiki/Humanism) programming
environment. Think of it as a mixture of **Mathematica, Scratch, and open datasets, swirled together into modern UX**.

Filament is meant to be accessible to all ages and levels of skill, from
children and novice programmers to artists, scientists, and even professionals
who are doing exploratory coding. The syntax is designed to be simple to
understand and forgiving of errors.

# Notable features

- All _math operations are really functions_ and can be applied to scalars, lists,
  and larger objects, as in array programmming langauges like
  [APL](<https://en.wikipedia.org/wiki/APL_(programming_language)>).
  ex: `4 * [1,2,3] = mulitply(4,List(1,2,3)) = [4,8,12]`

- _Identifiers and numbers are case-insensitive_ and can have \_'s anywhere in them without changing the meaning. ex:
  `is_prime = IsPrime` and `4_000_000 = 4000000 = 4*1000*1000`.

- All numbers have optional units and can perform unit arithmetic and conversions. ex: _How fast can Superman fly around
  the world?_ `earth.radius * 2 * π / 4000ft/s as hours = 9.11 hours`
