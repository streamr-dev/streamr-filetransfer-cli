import {expect, test} from '@oclif/test'
// smoke test
describe('send', () => {
  test
  .stdout()
  .command(['send', './package.json', '-k=0x35386ba5aba60565f886107ae6a343320c1eaac4a93a2587bf1192e0bdda66f7', '-s=0xee38446fD10BAE653459AD662FaE7Ff708c204b0/stream'])
  .it('runs send cmd', ctx => {
    expect(ctx.stdout).to.contain('')
  })
})
