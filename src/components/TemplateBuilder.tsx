import React from "react"
import { Layout } from "antd"
import {
	GridstackProvider,
	useGridstackContext,
} from "./Gridstack/GridstackContext"
import { ControlledGrid, ControlledStack } from "./ControlledGrid"
import {
	OctostarContextProvider,
	useOctostarContext,
} from "@octostar/platform-react"
import { SavedTemplate } from "@octostar/platform-types"
import LeftSidebar from "./LeftSidebar"
import { TemplateComposerMenu } from "./TemplateComposerMenu"
import "./TemplateBuilder.css"
import "gridstack/dist/gridstack-extra.css"
import "gridstack/dist/gridstack.css"

const { Content } = Layout

const filterTemplates = (
	all: SavedTemplate[],
	concept: string,
): SavedTemplate[] => {
	const filtered: SavedTemplate[] = []
	all.forEach((template) => {
		if (
			!concept &&
			(template.layout === "default" || template.layout === "base")
		) {
			filtered.push(template)
		}
		if (template.layout === "default" && template.concepts.includes(concept)) {
			filtered.push(template)
		}
		if (template.layout === "list" && template.concepts.includes(concept)) {
			filtered.push(template)
		}
		if (template.layout === "card" && template.concepts.includes(concept)) {
			filtered.push(template)
		}
		if (template.layout === "base") {
			filtered.push(template)
		}
	})
	return filtered
}

const TemplateBuilderComponent = () => {
	const { templates, setTemplates, entity } = useGridstackContext()
	const { DesktopAPI } = useOctostarContext()
	const [items, setItems] = React.useState([
		{ id: "PhoneCard", templateName: "PhoneCard", x: 0, y: 0, w: 2, h: 2 },
		{ id: "VehicleCard", templateName: "OsThingCard", x: 7, y: 1, w: 2, h: 2 },
	])

	React.useEffect(() => {
		if (!DesktopAPI) {
			return undefined
		}
		let mounted = true
		DesktopAPI?.showToast("Template Builder")
		const promises = [
			DesktopAPI?.getTemplates(),
			DesktopAPI?.getTemplates("list"),
			DesktopAPI?.getTemplates("card"),
		]
		Promise.all(promises).then((templates) => {
			if (mounted && templates) {
				const allTemplates: SavedTemplate[] = templates.flatMap(
					(templates) => templates ?? [],
				)
				setTemplates(filterTemplates(allTemplates, entity?.entity_type))
				console.log("TEST templates", allTemplates)
				console.log(
					"TEST filtered templates",
					filterTemplates(allTemplates, entity?.entity_type),
				)
			}
		})
		return () => {
			mounted = false
		}
	}, [DesktopAPI, entity?.entity_type, setTemplates])

	return (
		<Layout
			className="template-composer-custom-layout"
			style={{
				backgroundColor: "#e2e8f0",
				color: "black",
				minWidth: "99.6vw",
				overflow: "hidden",
				width: "100%",
				height: "100%",
				minHeight: "100vh",
				margin: 0,
			}}
		>
			<LeftSidebar />
			<Content
				style={{
					width: "100%",
					height: "100%",
					overflow: "hidden",
					backgroundColor: "#e2e8f0",
				}}
			>
				<TemplateComposerMenu />
				{DesktopAPI ? (
					<div
						style={{
							display: "flex",
							width: "auto",
							justifyContent: "flex-start",
							alignItems: "center",
							marginLeft: "520px",
						}}
					>
						<ControlledStack key="1" items={items} setItems={setItems} />
					</div>
				) : (
					<ControlledGrid />
				)}
			</Content>
		</Layout>
	)
}

const TemplateBuilderLoader = () => {
	return (
		<OctostarContextProvider>
			<GridstackProvider>
				<TemplateBuilderComponent />
			</GridstackProvider>
		</OctostarContextProvider>
	)
}

export const TemplateBuilder = () => {
	return <TemplateBuilderLoader />
}
