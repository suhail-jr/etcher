/*
 * Copyright 2016 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

/* eslint-disable jsdoc/require-example */

/**
 * @module Etcher.Components.SVGIcon
 */

const _ = require('lodash')
const angular = require('angular')
const react = require('react')
const propTypes = require('prop-types')
const react2angular = require('react2angular').react2angular
const path = require('path')
const fs = require('fs')

const MODULE_NAME = 'Etcher.Components.SVGIcon'
const angularSVGIcon = angular.module(MODULE_NAME, [])

const DEFAULT_SIZE = '40px'

const domParser = new window.DOMParser()

const tryParseContents = (contents) => {
  const doc = domParser.parseFromString(contents, 'image/svg+xml')
  const parserError = doc.querySelector('parsererror')
  const svg = doc.querySelector('svg')
  const svgXml = svg && _.isNil(parserError) ? svg.outerHTML : ''
  const svgData = `data:image/svg+xml,${encodeURIComponent(svgXml)}`

  return svgData
}

/**
 * @summary SVG element that takes both filepaths and file contents
 * @type {Object}
 * @public
 */
class SVGIcon extends react.Component {
  /**
   * @summary Render the SVG
   * @returns {react.Element}
   */
  render () {
    let imgData = ''

    imgData = tryParseContents(this.props.contents)

    if (!imgData) {
      // This means the path to the icon should be
      // relative to *this directory*.
      // TODO: There might be a way to compute the path
      // relatively to the `index.html`.
      const imagePath = path.join(__dirname, this.props.path)

      const contents = fs.readFileSync(imagePath, {
        encoding: 'utf8'
      })

      imgData = tryParseContents(contents)
    }

    const width = this.props.width || DEFAULT_SIZE
    const height = this.props.height || DEFAULT_SIZE

    return react.createElement('img', {
      className: 'svg-icon',
      style: {
        width,
        height
      },
      src: imgData,
      disabled: this.props.disabled,
    })
  }

  /**
   * @summary Cause a re-render due to changed element properties
   * @param {Object} nextProps - the new properties
   */
  componentWillReceiveProps (nextProps) {
    // This will update the element if the properties change
    this.setState(nextProps)
  }
}

SVGIcon.propTypes = {

  /**
   * @summary Path to SVG file
   */
  path: propTypes.string,

  /**
   * @summary Embedded SVG contents
   */
  contents: propTypes.string,

  /**
   * @summary SVG image width unit
   */
  width: propTypes.string,

  /**
   * @summary SVG image height unit
   */
  height: propTypes.string,

  /**
   * @summary Should the element visually appear grayed out and disabled?
   */
  disabled: propTypes.bool

}

angularSVGIcon.component('svgIcon', react2angular(SVGIcon))
module.exports = MODULE_NAME