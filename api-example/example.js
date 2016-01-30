function test(options) {
  var seneca = this;

  /**
   * GET /api/example - Simply returns an example object
   */
  function example(args, done) {
    done( null, {log:'example'} );
  }
  seneca.add('role:api,cmd:example', example);

}
module.exports = test;
