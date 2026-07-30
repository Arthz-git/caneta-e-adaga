/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module 'typewriter-effect/dist/core' {
	type Speed = 'natural' | number

	export default class Typewriter {
		constructor(container: Element | string | null, options?: {
			loop?: boolean
			delay?: Speed
			deleteSpeed?: Speed
			cursor?: string
		})

		typeString(text: string): this
		pauseFor(ms: number): this
		deleteAll(speed?: Speed): this
		callFunction(callback: () => void): this
		start(): this
		stop(): this
	}
}