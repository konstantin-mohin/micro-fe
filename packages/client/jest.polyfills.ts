/**
 * @note The order of these polyfills matters.
 */

/* eslint-disable @typescript-eslint/no-require-imports */

const { TextDecoder, TextEncoder } = require('node:util')
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web')

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, enumerable: true, configurable: true },
  TextEncoder: { value: TextEncoder, enumerable: true, configurable: true },
  ReadableStream: { value: ReadableStream, enumerable: true, configurable: true },
  TransformStream: { value: TransformStream, enumerable: true, configurable: true },
  WritableStream: { value: WritableStream, enumerable: true, configurable: true },
})

const { MessageChannel, MessagePort, BroadcastChannel } = require('node:worker_threads')
Object.defineProperties(globalThis, {
  MessageChannel: { value: MessageChannel, enumerable: true, configurable: true },
  MessagePort: { value: MessagePort, enumerable: true, configurable: true },
  BroadcastChannel: { value: BroadcastChannel, enumerable: true, configurable: true },
})

const { Blob, File } = require('node:buffer')
const { fetch, Headers, FormData, Request, Response } = require('undici')

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, enumerable: true, configurable: true },
  Blob: { value: Blob, enumerable: true, configurable: true },
  File: { value: File, enumerable: true, configurable: true },
  Headers: { value: Headers, enumerable: true, configurable: true },
  FormData: { value: FormData, enumerable: true, configurable: true },
  Request: { value: Request, enumerable: true, configurable: true },
  Response: { value: Response, enumerable: true, configurable: true },
})
