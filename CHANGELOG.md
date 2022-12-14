## [2.0.2](https://github.com/bloc-state/bloc/compare/v2.0.1...v2.0.2) (2022-12-14)


### Bug Fixes

* **docs:** fixed badges URL ([82ac502](https://github.com/bloc-state/bloc/commit/82ac50200a88252883c4cac26e57c6c8722bf889))

## [2.0.1](https://github.com/bloc-state/bloc/compare/v2.0.0...v2.0.1) (2022-12-09)


### Bug Fixes

* **tsup:** added keepNames to build config ([1a164e3](https://github.com/bloc-state/bloc/commit/1a164e30967c804f239a7abde2eb8dd4c5077bc5))

# [2.0.0](https://github.com/bloc-state/bloc/compare/v1.0.0...v2.0.0) (2022-11-24)


* v2.0.0 (#9) ([a66e3da](https://github.com/bloc-state/bloc/commit/a66e3da68502d057a23394a75b34f870c0289b3b)), closes [#9](https://github.com/bloc-state/bloc/issues/9)


### Features

* added generic type to BlocConfig ([2cd1cda](https://github.com/bloc-state/bloc/commit/2cd1cdaecda0972cd0ad01b8d1f5ba0074ddceb7))
* **BlocBase:** added new constructor parameter BlocConfig ([c23198b](https://github.com/bloc-state/bloc/commit/c23198bc4e7cd7d2dc97a01c3477bbf0c1d7b89a))
* **BlocBase:** use BehaviorSubject instead of Subject internally ([d2355d8](https://github.com/bloc-state/bloc/commit/d2355d804e5515288d2cb832fc89d34949846d04))
* **BlocObserver:** added onClose method ([0915b73](https://github.com/bloc-state/bloc/commit/0915b73926ee1b1187714b0921f0ddf2bdc0e8fb))
* **Bloc:** remove BlocConfig ([285a01f](https://github.com/bloc-state/bloc/commit/285a01f5750bd55f1cc22ea3a65114f995ba0099))
* rewrite bloc/cubit to conform to bloc 8.0 api ([d1308fe](https://github.com/bloc-state/bloc/commit/d1308fe6a8baabea40d532133d15f886380dd5ae))
* **transformer:** move event transformers to another package ([e560948](https://github.com/bloc-state/bloc/commit/e56094865b43297fb96d6f8b5580d4b2f32e2a62))


### BREAKING CHANGES

* bloc and cubit will now handle concurrency in a similar
manner to Bloc v8.x

* chore(release): set `package.json` to 2.0.0-beta.1 [skip ci]

# [2.0.0-beta.1](https://github.com/bloc-state/bloc/compare/v1.0.0...v2.0.0-beta.1) (2022-11-17)

### Features

* rewrite bloc/cubit to conform to bloc 8.0 api ([d1308fe](https://github.com/bloc-state/bloc/commit/d1308fe6a8baabea40d532133d15f886380dd5ae))

### BREAKING CHANGES

* bloc and cubit will now handle concurrency in a similar
manner to Bloc v8.x

* feat(BlocBase): use BehaviorSubject instead of Subject internally

* chore(release): set `package.json` to 2.0.0-beta.2 [skip ci]

# [2.0.0-beta.2](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2022-11-18)

### Features

* **BlocBase:** use BehaviorSubject instead of Subject internally ([d2355d8](https://github.com/bloc-state/bloc/commit/d2355d804e5515288d2cb832fc89d34949846d04))

* feat(BlocBase): added new constructor parameter BlocConfig

BlocConfig will have Bloc specific configurable options, ex: a
comparison function that can be provided to BlocConfig for comparing between
transitioning of states.

* chore(release): set `package.json` to 2.0.0-beta.3 [skip ci]

# [2.0.0-beta.3](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2022-11-18)

### Features

* **BlocBase:** added new constructor parameter BlocConfig ([c23198b](https://github.com/bloc-state/bloc/commit/c23198bc4e7cd7d2dc97a01c3477bbf0c1d7b89a))

* build(deps): bump @bloc-state/state to 2.0.0-beta.4

* test: added expect.assertions to all tests

* feat: added generic type to BlocConfig

* chore(release): set `package.json` to 2.0.0-beta.4 [skip ci]

# [2.0.0-beta.4](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2022-11-20)

### Features

* added generic type to BlocConfig ([2cd1cda](https://github.com/bloc-state/bloc/commit/2cd1cdaecda0972cd0ad01b8d1f5ba0074ddceb7))

* refactor(types): removed unused types

* feat(transformer): move event transformers to another package

* chore(release): set `package.json` to 2.0.0-beta.5 [skip ci]

# [2.0.0-beta.5](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2022-11-23)

### Features

* **transformer:** move event transformers to another package ([e560948](https://github.com/bloc-state/bloc/commit/e56094865b43297fb96d6f8b5580d4b2f32e2a62))

* ci(semantic-release): remove redundant installation [skip-ci]

* ci(codecov): added codecov github action to ci

* feat(BlocObserver): added onClose method

* chore(release): set `package.json` to 2.0.0-beta.6 [skip ci]

# [2.0.0-beta.6](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2022-11-24)

### Features

* **BlocObserver:** added onClose method ([0915b73](https://github.com/bloc-state/bloc/commit/0915b73926ee1b1187714b0921f0ddf2bdc0e8fb))

* docs(reademe): update readme

* feat(Bloc): remove BlocConfig

* chore(release): set `package.json` to 2.0.0-beta.7 [skip ci]

# [2.0.0-beta.7](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2022-11-24)

### Features

* **Bloc:** remove BlocConfig ([285a01f](https://github.com/bloc-state/bloc/commit/285a01f5750bd55f1cc22ea3a65114f995ba0099))

Co-authored-by: semantic-release-bot <semantic-release-bot@martynus.net>
* bloc and cubit will now handle concurrency in a similar
manner to Bloc v8.x

# [2.0.0-beta.7](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2022-11-24)


### Features

* **Bloc:** remove BlocConfig ([285a01f](https://github.com/bloc-state/bloc/commit/285a01f5750bd55f1cc22ea3a65114f995ba0099))

# [2.0.0-beta.6](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2022-11-24)


### Features

* **BlocObserver:** added onClose method ([0915b73](https://github.com/bloc-state/bloc/commit/0915b73926ee1b1187714b0921f0ddf2bdc0e8fb))

# [2.0.0-beta.5](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2022-11-23)


### Features

* **transformer:** move event transformers to another package ([e560948](https://github.com/bloc-state/bloc/commit/e56094865b43297fb96d6f8b5580d4b2f32e2a62))

# [2.0.0-beta.4](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2022-11-20)


### Features

* added generic type to BlocConfig ([2cd1cda](https://github.com/bloc-state/bloc/commit/2cd1cdaecda0972cd0ad01b8d1f5ba0074ddceb7))

# [2.0.0-beta.3](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2022-11-18)


### Features

* **BlocBase:** added new constructor parameter BlocConfig ([c23198b](https://github.com/bloc-state/bloc/commit/c23198bc4e7cd7d2dc97a01c3477bbf0c1d7b89a))

# [2.0.0-beta.2](https://github.com/bloc-state/bloc/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2022-11-18)


### Features

* **BlocBase:** use BehaviorSubject instead of Subject internally ([d2355d8](https://github.com/bloc-state/bloc/commit/d2355d804e5515288d2cb832fc89d34949846d04))

# [2.0.0-beta.1](https://github.com/bloc-state/bloc/compare/v1.0.0...v2.0.0-beta.1) (2022-11-17)


### Features

* rewrite bloc/cubit to conform to bloc 8.0 api ([d1308fe](https://github.com/bloc-state/bloc/commit/d1308fe6a8baabea40d532133d15f886380dd5ae))


### BREAKING CHANGES

* bloc and cubit will now handle concurrency in a similar
manner to Bloc v8.x

# 1.0.0 (2022-11-15)


### Features

* initial commit ([e6cd78b](https://github.com/bloc-state/bloc/commit/e6cd78bc18e0c86e2dc6900f89f912a5d19924eb))

## [1.1.1](https://github.com/bloc-state/core/compare/v1.1.0...v1.1.1) (2022-11-15)

### Bug Fixes

- **release:** fix release version ([e3f10fd](https://github.com/bloc-state/core/commit/e3f10fd5ecbe212b6d523a88bb99e16022d7d284))
- **release:** npmjs registry fix ([b307c2b](https://github.com/bloc-state/core/commit/b307c2b99731e9212243d5538ff5df5374abe55a))

## [1.1.1](https://github.com/bloc-state/core/compare/v1.1.0...v1.1.1) (2022-11-15)

### Bug Fixes

- **release:** npmjs registry fix ([b307c2b](https://github.com/bloc-state/core/commit/b307c2b99731e9212243d5538ff5df5374abe55a))

# [1.1.0](https://github.com/bloc-state/core/compare/v1.0.2...v1.1.0) (2022-11-15)

### Features

- **bloc:** changed getDerivedState argument types ([1a49cb2](https://github.com/bloc-state/core/commit/1a49cb2abef76c3f27d56dfd5025aaa02f1596e2))

## [1.0.2](https://github.com/bloc-state/core/compare/v1.0.1...v1.0.2) (2022-11-08)

### Bug Fixes

- **dep:** move some dependencies into peer dependencies ([2b29fb9](https://github.com/bloc-state/core/commit/2b29fb972c92b79c90ee01d4abcc9ef7d2dae09b))

## [1.0.1](https://github.com/bloc-state/core/compare/v1.0.0...v1.0.1) (2022-11-08)

### Bug Fixes

- **dep:** added semantic release plugins for changelog ([ae3db92](https://github.com/bloc-state/core/commit/ae3db92322cf1c65606d3efe39a1a0b035c32916))
- update intial commit version ([8a5aa2d](https://github.com/bloc-state/core/commit/8a5aa2dfdd95b78417b9568e37c541c27c30c06f))

# 1.0.0 (2022-11-08)

### Features

- initial commit ([ac33287](https://github.com/bloc-state/core/commit/ac332876384d88970125546ce5bfae0213510ef2))
