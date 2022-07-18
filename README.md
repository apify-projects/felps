    ⏰  The project is still in an early stage and is bound to have drastic changes.
        Feel free to go through the repo or reach out to know more.

<br>

![Cagibi Illustration](media/header.jpg)

<br>

    Flow-based crawler framework

`npm i felps` / `yarn add felps`

[![Version](https://img.shields.io/npm/v/felps?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/felps)
[![Downloads](https://img.shields.io/npm/dt/felps.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/felps)

*Felps' name comes from the phonetic sound of the name of a well-known international swimmer.*



### What is `felps`?
- Soon
### When would `felps` come in handy?
Soon.


---

### Patterns Used
**1. Functional Programming / Pure functions**
- mostly based on functions building & interacting with objects (mostly no class instances)
- functions return identical values for identical arguments
- functions have no side-effects (no mutation of global variables)

For example, every module is instantiated via a method called `create` which returns a plain object.

**2. Hooks based**
- Provide a list of hooks as part of an module instance definition whenever possible to allow the user to control/extend its behavior

**3. Independent packages**
- Enforce a modular system to be able to use any module in any desired way
