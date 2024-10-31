import { GridStack } from "gridstack"
import React, { createRef, useEffect, useState } from "react"
import { StaticGrid } from "./StaticGrid"
import { ItemTemplateBuilder } from "../lib/types"
import { useGridstackContext } from "./Gridstack/GridstackContext"
import { OsTemplate, useOctostarContext } from "@octostar/platform-react"
import "gridstack/dist/gridstack-extra.css"
import "gridstack/dist/gridstack.css"
import { WorkspaceItem } from "@octostar/platform-types"

const Item = ({ item }: { item: ItemTemplateBuilder }) => (
	<div>
		<div style={{ height: "20%", minHeight: "40px" }}>
			{item?.templateName || item.id}
		</div>
		<div style={{ height: "80%", minHeight: "auto" }}>
			{item.w} x {item.h}
		</div>
	</div>
)

export const ControlledGrid = () => {
	const [items, setItems] = useState([
		{ id: "PhoneCard", x: 0, y: 0, w: 1, h: 1 },
		{ id: "VehicleCard", x: 2, y: 0, w: 2, h: 2 },
	])
	const [items2, setItems2] = useState([
		{ id: "OsThingCard", x: 0, y: 0, w: 2, h: 2 },
		{ id: "PersonCard", x: 7, y: 1, w: 2, h: 2 },
	])

	React.useEffect(() => {
		console.log("TEST items", items)
	}, [items])

	React.useEffect(() => {
		console.log("TEST items2", items2)
	}, [items2])

	return (
		<div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
			<div style={{ display: "flex", width: "100%", flexDirection: "row" }}>
				<div style={{ display: "flex", width: "50%" }}>
					<ControlledStack key="1" items={items} setItems={setItems} />
				</div>
				<div style={{ display: "flex", width: "50%" }}>
					<ControlledStack key="1" items={items} setItems={setItems2} />
				</div>
			</div>

			<div style={{ display: "flex", width: "100%", flexDirection: "row" }}>
				<div style={{ display: "flex", width: "50%" }}>
					<StaticGrid items={items} />
				</div>
				<div style={{ display: "flex", width: "50%" }}>
					<StaticGrid items={items2} />
				</div>
			</div>
		</div>
	)
}

interface ControlledStackProps {
	items: ItemTemplateBuilder[]
	setItems: any
}

export const ControlledStack = ({ items, setItems }: ControlledStackProps) => {
	const refs = React.useRef({})
	const gridContaniarRef = React.useRef(null)
	const { gridRef, entity } = useGridstackContext()
	const { DesktopAPI, OntologyAPI } = useOctostarContext()

	if (Object.keys(refs.current).length !== items.length) {
		items.forEach(({ id }: any) => {
			refs.current[id] = refs.current[id] || createRef()
		})
	}

	useEffect(() => {
		if (!gridContaniarRef.current) return
		gridRef.current =
			gridRef.current ||
			GridStack.init(
				{
					float: true,
					resizable: { handles: "se" },
					column: 12,
					minRow: 12,
					removable: true,
					acceptWidgets: true,
					staticGrid: false,
				},
				gridContaniarRef.current,
			)
		if (!gridRef.current) return
		const grid = gridRef.current as GridStack
		grid.batchUpdate()
		grid.removeAll(false)
		items.forEach(({ id }) => grid.makeWidget(refs.current[id].current))
		grid.batchUpdate(false)
	}, [gridRef, items, setItems])

	return (
		<div>
			<div className="grid-stack controlled full" ref={gridContaniarRef}>
				{items.map((item, i) => {
					return (
						<div
							ref={refs.current[item.id]}
							key={item.id}
							gs-id={item.id}
							gs-w={item.w}
							gs-h={item.h}
							gs-x={item.x}
							gs-y={item.y}
							className={"grid-stack-item"}
							style={{
								display: "flex",
								cursor: "move",
							}}
						>
							<div className="grid-stack-item-content">
								{item?.templateName ? (
									<div style={{ width: "100%", height: "100%" }}>
										<OsTemplate
											layout="card"
											style={{
												width: "100%",
												height: "100%",
												transform: "scale(0.7)",
												transformOrigin: "0 0",
												margin: "auto",
												padding: "auto",
											}}
											record={
												entity
													? entity
													: ({
															entity_id: "8de9c6bb-5693-4717-b86e-c109cc91588b",
															entity_type: "person",
															entity_label: "Susan Wallace Anthony",
													  } as WorkspaceItem)
											}
											context={{ DesktopAPI, OntologyAPI }}
										/>
									</div>
								) : (
									<Item item={item} />
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export const ControlledStackSidebar = ({
	items,
}: {
	items: ItemTemplateBuilder[]
}) => {
	return (
		<div>
			{items.map((item, i) => {
				return <ControlledItemSidebarWrapper key={i} item={item} />
			})}
		</div>
	)
}

const ControlledItemSidebarWrapper = ({
	item,
}: {
	item: ItemTemplateBuilder
}) => {
	const [show, setShow] = React.useState(true)
	const handleRemove = () => {
		setShow(false)
	}
	if (!show) {
		return null
	}
	return <ControlledItemSidebar item={item} handleRemove={handleRemove} />
}

const ControlledItemSidebar = ({
	item,
	handleRemove,
}: {
	item: ItemTemplateBuilder
	handleRemove: () => void
}) => {
	const ref = React.useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>(
		{},
	)
	const gridRef = React.useRef<GridStack | null>(null)
	const gridContaniarRef = React.useRef(null)
	const { setItemsSidebar, entity } = useGridstackContext()
	const { DesktopAPI, OntologyAPI } = useOctostarContext()

	if (Object.keys(ref.current).length !== 1) {
		ref.current[item.id] = ref.current[item.id] || createRef()
	}

	useEffect(() => {
		if (!gridContaniarRef.current) return
		gridRef.current =
			gridRef.current ||
			GridStack.init(
				{
					float: true,
					resizable: undefined,
					column: item.w || 4,
					row: item.h || 4,
					removable: true,
					acceptWidgets: true,
					staticGrid: false,
				},
				gridContaniarRef.current,
			)
		const grid = gridRef.current as GridStack

		grid.batchUpdate()
		grid.removeAll(false)
		const element = ref.current[item.id].current
		if (element) {
			grid.makeWidget(element)
		}
		grid.batchUpdate(false)
	}, [handleRemove, item, setItemsSidebar])

	return (
		<div>
			<div className={`grid-stack controlled sidebar`} ref={gridContaniarRef}>
				<div
					ref={ref.current[item.id]}
					key={item.id}
					gs-id={item.id}
					gs-w={item.w}
					gs-h={item.h}
					gs-x={0}
					gs-y={0}
					className={"grid-stack-item"}
					style={{
						position: "relative",
						display: "flex",
						cursor: "move",
					}}
				>
					<div className="grid-stack-item-content">
						{item?.layout ? (
							<div>
								<OsTemplate
									layout={item.layout}
									style={{
										width: "100%",
										height: "100%",
										transform: "scale(0.5)",
										transformOrigin: "0 0",
										margin: "0",
										padding: "0",
									}}
									record={
										entity
											? entity
											: ({
													entity_id: "8de9c6bb-5693-4717-b86e-c109cc91588b",
													entity_type: "person",
													entity_label: "Susan Wallace Anthony",
											  } as WorkspaceItem)
									}
									context={{ DesktopAPI, OntologyAPI }}
								/>
							</div>
						) : item?.templateName ? (
							<div>
								<OsTemplate
									templateName={item.templateName}
									style={{
										width: "100%",
										height: "100%",
										transform: "scale(0.5)",
										transformOrigin: "0 0",
										margin: "0",
										padding: "0",
									}}
									record={
										entity
											? entity
											: ({
													entity_id: "8de9c6bb-5693-4717-b86e-c109cc91588b",
													entity_type: "person",
													entity_label: "Susan Wallace Anthony",
											  } as WorkspaceItem)
									}
									context={{ DesktopAPI, OntologyAPI }}
								/>
							</div>
						) : (
							<Item item={item} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
