import React from "react"
import { Button, Typography } from "antd"
import { GridStack } from "gridstack"
import { useGridstackContext } from "./Gridstack/GridstackContext"
import {
	CloseOutlined,
	SearchOutlined,
	SettingOutlined,
} from "@ant-design/icons"
import "./TemplateComposerMenu.css"
import { useOctostarContext } from "@octostar/platform-react"

export const TemplateComposerMenu = () => {
	const { gridRef, entity, setEntity } = useGridstackContext()
	const { DesktopAPI } = useOctostarContext()

	const handleSave = React.useCallback(() => {
		if (!gridRef.current) {
			console.log("TEST gridRef.current", gridRef.current)
			return
		}
		const grid = gridRef.current as GridStack
		const items = grid.engine.nodes.map((node) => {
			const { x, y, w, h, id } = node
			return { x, y, w, h, id }
		})
		console.log("TEST grid", grid)
		console.log("TEST items", JSON.stringify(items))
		console.log("TEST opts", JSON.stringify(grid.opts))
	}, [gridRef])

	const handleSearch = React.useCallback(() => {
		if (!DesktopAPI) {
			console.log("Error getting DesktopAPI")
			return
		}
		DesktopAPI.getSearchResults(undefined, true)
			.then((results) => {
				console.log("TEST results", results)
			})
			.catch((error) => {
				DesktopAPI.showToast({
					description: "Error getting search results",
					level: "error",
					message: "Ops! Something went wrong",
				})
			})
		console.log("TEST handleSearch")
	}, [DesktopAPI])
	return (
		<div className="template-composer-menu-container">
			<div style={{ height: "100%", display: "flex", alignItems: "center" }}>
				<Typography.Title
					level={3}
					style={{
						height: "38px",
						marginLeft: "520px",
					}}
				>
					Template Composer
				</Typography.Title>
			</div>
			<div style={{ display: "flex", gap: "8px" }}>
				{entity ? (
					<Button
						icon={<CloseOutlined />}
						onClick={() => setEntity(undefined)}
					/>
				) : (
					<Button icon={<SearchOutlined />} onClick={() => handleSearch()}>
						Search
					</Button>
				)}

				<Button type="primary" onClick={handleSave} disabled>
					Save
				</Button>
				<Button type="default" icon={<SettingOutlined />} onClick={() => {}} />
			</div>
		</div>
	)
}
