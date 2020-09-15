import { validator } from '@ioc:Adonis/Core/Validator'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

validator.rule('phone', (value, _, { pointer, arrayExpressionPointer, errorReporter }) => {
  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  // if (typeof (value) !== 'string') {
  //   return
  // }

  /**
   * Parse phone number from a string
   */
  const phoneNumber = parsePhoneNumberFromString(value.toString(), 'BR')

  /**
   * Report error when phone number is not valid
   */
  if (!phoneNumber || !phoneNumber.isValid()) {
    errorReporter.report(pointer, 'phone', 'Invalid phone', arrayExpressionPointer)
  }
})
