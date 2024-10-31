import React, { createRef, useEffect, useState, useRef } from "react"
import { GridStack } from "gridstack"
import { StaticGrid } from "./StaticGrid"
import { ItemTemplateBuilder } from "../lib/types"
import "gridstack/dist/gridstack-extra.css"
import "gridstack/dist/gridstack.css"
import "./ControlledGrid.css"

const Item = ({ item }: { item: ItemTemplateBuilder }) => <div>{item.id}</div>

export const BuilderGrid = () => {
	const [items, setItems] = useState<ItemTemplateBuilder[]>([
		{ id: "item-1-1", x: 0, y: 0, w: 1, h: 1 },
		{ id: "item-1-2", x: 2, y: 0, w: 2, h: 2 },
	])
	const [items2, setItems2] = useState<ItemTemplateBuilder[]>([
		{ id: "item-2-1", x: 0, y: 0, w: 2, h: 2 },
		{ id: "item-2-2", x: 7, y: 1, w: 2, h: 2 },
	])

	useEffect(() => {
		console.log("TEST items", items)
	}, [items])

	useEffect(() => {
		console.log("TEST items2", items2)
	}, [items2])

	return (
		<div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
			<div style={{ display: "flex", width: "100%", flexDirection: "row" }}>
				<div style={{ display: "flex", width: "50%" }}>
					<ControlledStack
						key="1"
						items={items}
						setItems={setItems}
						addItem={() =>
							setItems([
								...items,
								{
									id: `item-${crypto.randomUUID()}`,
									x: 2,
									y: 0,
									w: 2,
									h: 2,
								},
							])
						}
					/>
				</div>
				<div style={{ display: "flex", width: "50%" }}>
					<ControlledStack
						key="2"
						items={items2}
						setItems={setItems2}
						addItem={() =>
							setItems2([
								...items2,
								{
									id: `item-${crypto.randomUUID()}`,
									x: 2,
									y: 0,
									w: 2,
									h: 2,
								},
							])
						}
					/>
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
	setItems: React.Dispatch<React.SetStateAction<ItemTemplateBuilder[]>>
	addItem: () => void
}

const ControlledStack = ({
	items,
	addItem,
	setItems,
}: ControlledStackProps) => {
	const refs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})
	const gridRef = useRef<GridStack | null>(null)
	const gridContainerRef = useRef<HTMLDivElement>(null)

	// Initialize refs for new items
	if (Object.keys(refs.current).length !== items.length) {
		items.forEach(({ id }) => {
			refs.current[id] = refs.current[id] || createRef<HTMLDivElement>()
		})
	}

	// Effect to initialize and update GridStack
	useEffect(() => {
		if (!gridContainerRef.current) return

		// Initialize GridStack if not already initialized
		gridRef.current =
			gridRef.current ||
			GridStack.init(
				{
					float: true,
					resizable: {
						handles: "se",
					},
					column: 12,
					row: 12,
					removable: true,
					acceptWidgets: true,
					staticGrid: false,
				},
				gridContainerRef.current,
			)

		if (!gridRef.current) return

		const grid = gridRef.current

		// Update grid items
		grid.batchUpdate()
		grid.removeAll(false) // Remove existing widgets without destroying them
		items.forEach(({ id }) => {
			const element = refs?.current?.[id]?.current
			if (element) {
				grid.makeWidget(element)
			}
		})
		grid.batchUpdate(false)
	}, [items])

	// Handler to save the grid layout
	const handleSave = () => {
		if (!gridRef.current) {
			console.log("TEST gridRef.current", gridRef.current)
			return
		}
		const grid = gridRef.current

		// Extract item positions from GridStack nodes
		const updatedItems = grid.engine.nodes.map((node) => {
			const { el, grid, subGridOpts, subGrid, ...rest } = node
			if (rest.id === undefined) {
				rest.id = `item-${crypto.randomUUID()}`
			}
			return { ...rest } as ItemTemplateBuilder
		})

		// Update the state with new item positions
		setItems(updatedItems)

		console.log("TEST grid", grid)
		console.log("TEST items", JSON.stringify(updatedItems))
		console.log("TEST opts", JSON.stringify(grid.opts))
	}

	return (
		<div>
			<button onClick={addItem}>Add new widget</button>
			<button onClick={handleSave}>Save</button>

			{/* Grid container */}
			<div className="grid-stack controlled" ref={gridContainerRef}>
				{items.map((item) => {
					return (
						<div
							ref={refs.current[item.id]}
							key={item.id}
							data-gs-id={item.id}
							data-gs-w={item.w}
							data-gs-h={item.h}
							data-gs-x={item.x}
							data-gs-y={item.y}
							className="grid-stack-item"
							style={{
								position: "relative",
								display: "flex",
								cursor: "move",
							}}
						>
							<div className="grid-stack-item-content">
								<Item item={item} />
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
