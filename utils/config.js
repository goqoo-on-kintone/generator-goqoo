'use strict'
const opts = require('./configopts.json')

/**
 * Get a setting
 * @param  {String} setting
 * @return {Mixed} setting or null if not found
 */
const getSetting = setting => {
  return opts[setting] !== undefined ? opts[setting] : null
}

/**
 * Get choices for a given setting
 * @param  {String} setting
 * @return {Mixed} Result or null if nothing was found
 */
const getChoices = function getChoices (setting) {
  const config = getSetting(setting)
  return config && Array.isArray(config.options) ? config.options : null
}

/**
 * Get the wanted choice by key
 * @param  {String} setting
 * @param  {String} key
 * @return {Object}
 */
const getChoiceByKey = (setting, key) => {
  const choices = getChoices(setting)
  if (!choices) {
    return null
  }

  let result = null

  for (const choice of choices) {
    if (choice.name === key) {
      result = choice
      break
    }
  }

  return result
}

/**
 * Get the default choice for a config setting
 * @param  {String} setting
 * @return {Mixed}
 */
const getDefaultChoice = setting => {
  const config = getSetting(setting)
  return config && config.default !== undefined && config.default.length > 0 ? config.default : null
}

module.exports = {
  getSetting,
  getChoices,
  getChoiceByKey,
  getDefaultChoice,
}
