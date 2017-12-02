const DIGITS = token(sep1(/[0-9]+/, /_+/))
const HEX_DIGITS = token(sep1(/[A-Fa-f0-9]+/, '_'))

module.exports = grammar({
  name: 'java',

  extras: $ => [
    $.comment,
    /\s/
  ],
  // what are extras?

  rules: {
    program: $ => repeat(seq($._statement, ';')),
    // program: $ => repeat($.declaration)

    _statement: $ => choice($._literal),

    _literal: $ => choice(
      $.integer_literal,
      $.floating_point_literal,
      // $.boolean_literal,
      // $.character_literal,
      // $.string_literal,
      // $.null_literal
    ),

    // integer literals

    integer_literal: $ => choice(
      $.decimal_integer_literal,
      $.hex_integer_literal,
      $.octal_integer_literal,
      $.binary_integer_literal
    ),

    decimal_integer_literal: $ => DIGITS,

    hex_integer_literal: $ => token(seq(
        choice('0x', '0X'),
        HEX_DIGITS
    )),

    // how does this not get parsed as regular integers?
    octal_integer_literal: $ => token(seq(
      choice('0o', '0O'),
      sep1(/[0-7]+/, '_')
      )),

    binary_integer_literal: $ => token(seq(
      choice('0b', '0B'),
      sep1(/[01]+/, '_')
    )),

    floating_point_literal: $ => choice(
      $.decimal_floating_point_literal,
      $.hex_floating_point_literal
    ),

    decimal_floating_point_literal: $ => token(
      choice(
        seq(DIGITS, '.', optional(DIGITS), optional(seq((/[eE]/), optional(choice('-', '+')), DIGITS)), optional(/[fFdD]/)),
        seq('.', DIGITS, optional(seq((/[eE]/), optional(choice('-','+')), DIGITS)), optional(/[fFdD]/)),
        seq(DIGITS, /[eE]/, optional(choice('-','+')), DIGITS, optional(/[fFdD]/)),
        seq(DIGITS, optional(seq((/[eE]/), optional(choice('-','+')), DIGITS)), (/[fFdD]/))
      )),

    hex_floating_point_literal: $ => token(seq(
      choice('0x', '0X'),
      choice(
        seq(HEX_DIGITS, optional('.')),
        seq(optional(HEX_DIGITS), '.', HEX_DIGITS)
      ),
        /[eE]/,
      optional(choice('-','+')),
      DIGITS,
      optional(/[fFdD]/)
    )),

    // boolean_literal: $ => token(choice('true', 'false')),
    //
    // character_literal: $ => /\?(\\\S({[0-9]*}|[0-9]*|-\S([MC]-\S)?)?|\S)/
    //
    // string_literal: $ => /""/

    comment: $ => /\/\*.*\*\//,

  }
});

function sep1 (rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}