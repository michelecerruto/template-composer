export type ItemTemplateBuilder = {
	id: string // template_id or app_id
	x: number
	y: number
	w: number
	h: number
	content?: string
	isApp?: boolean
	appName?: string
	templateName?: string
	width?: number
	height?: number
	savedTemplate?: any
	layout?: string
}
