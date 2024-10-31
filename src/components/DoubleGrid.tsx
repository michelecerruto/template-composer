import { GridStack } from "gridstack"
import React, {
	createRef,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react"
import "gridstack/dist/gridstack-extra.css"
import "gridstack/dist/gridstack.css"

const Item = ({ id }: { id: string }) => <div>{id}</div>

const ControlledStack = ({ items, addItem, changeItems }) => {
	const refs = useRef({})
	const gridRef = useRef()
	const gridContainerRef = useRef(null)

	if (Object.keys(refs.current).length !== items.length) {
		items.forEach(({ id }) => {
			refs.current[id] = refs.current[id] || createRef()
		})
	}

	useEffect(() => {
		if (!gridRef.current) {
			// no need to init twice (would will return same grid) or register dup events
			const grid = (gridRef.current = GridStack.init(
				{
					float: false,
					acceptWidgets: true,
					column: 6,
					minRow: 1,
					removable: true,
				},
				gridContainerRef.current,
			)

				.on("added", (ev, gsItems) => {
					if (grid._ignoreCB) return

					// remove the new element as React will re-create it again (dup) once we add to the list or we get 2 of them with same ids but different DOM el!
					// TODO: this is really not ideal - we shouldn't mix React templating with GS making it own edits as those get out of sync! see comment below ~96.
					gsItems.forEach((n) => {
						grid.removeWidget(n.el, false, false) // true=remove DOM, false=don't call use back!
						// can't pass n directly even though similar structs as it has n.el.gridstackNode which gives JSON error for circular write.
						// addItem({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h })
					})
					refresh()
				})
				.on("removed", (ev, gsItems) => {
					// synch our version from GS....
					// Note: we could just update those few items passed but save() is fast and it's easier to just set an entire new list
					// and since we have the same ids, React will not re-create anything...
					const newItems = items.filter(
						(i) => !gsItems.find((n) => n.id === i.id),
					)
					// changeItems(newItems)

					gsItems.forEach((n) => {
						grid.removeWidget(n.el, false, false) // true=remove DOM, false=don't call use back!
						// can't pass n directly even though similar structs as it has n.el.gridstackNode which gives JSON error for circular write.
						// changeItems(items.filter((i) => i.id !== n.id))
					})
					// refresh()
					/*
					refresh()

					// const newItems = grid.save(false) // Get the updated layout
					// changeItems(newItems)

					// changeItems(newItems)
					// gsItems.forEach((n) => {
					// grid.removeWidget(n.el, true, false) // true=remove DOM, false=don't call use back!
					// can't pass n directly even though similar structs as it has n.el.gridstackNode which gives JSON error for circular write.
					// addItem({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h })
					// changeItems(items.filter((i) => i.id !== n.id))
					// })
					// const newItems = grid.save(false) // saveContent=false
					// changeItems(newItems)
                    */
				}))

			// addEvents(grid, i);
		} else {
			//
			// update existing GS layout, which is optimized to updates only diffs and add new/delete items as well
			//
			const grid = gridRef.current
			const layout = items.map(
				(a) =>
					// use exiting nodes (which will skip diffs being the same) else new elements Widget but passing the React dom .el so we know what to makeWidget() on!
					refs.current[a.id].current.gridstackNode || {
						...a,
						el: refs.current[a.id].current,
					},
			)
			grid._ignoreCB = true // hack: ignore added/removed since we're the one doing the update
			grid.load(layout)
			delete grid._ignoreCB
		}
	}, [items])

	return (
		// ********************
		// NOTE: constructing DOM grid items in template when gridstack is also allowed creating (dragging between grids, or adding/removing from say a toolbar)
		// is NOT A GOOD IDEA as you end up fighting between gridstack users' edits and your template items structure which are not in sync.
		// At best, you end up re-creating widgets DOM (from React template) and all their content & state after a widget was inserted/re-parented by the user.
		// a MUCH better way is to let GS create React components using it's API/user interactions, with only initial load() of a stored layout.
		// See the Angular component wrapper that does that: https://github.com/gridstack/gridstack.js/tree/master/angular/ (lib author uses Angular)
		// ...TBD creating React equivalent...
		//
		// Also templating forces you to spell out the 15+ GridStackWidget attributes (only x,y,w,h done below), instead of passing an option structure that
		// supports everything, is not robust as things get added and pollutes the DOM attr for default/missing entries, vs the optimized code in GS.
		// ********************
		<div style={{ width: "100%", marginRight: "10px" }} key="test">
			<div className="grid-stack" ref={gridContainerRef}>
				{items?.map((item, i) => {
					return (
						<div
							ref={refs.current[item.id]}
							key={item.id}
							className="grid-stack-item"
							gs-id={item.id}
							gs-w={item.w}
							gs-h={item.h}
							gs-x={item.x}
							gs-y={item.y}
						>
							<div className="grid-stack-item-content">
								<Item {...item} />
							</div>
						</div>
					)
				})}
			</div>
			<code>
				<pre>{JSON.stringify(items, null, 2)}</pre>
			</code>
		</div>
	)
}

export const DoubleGrid = () => {
	const [items1, setItems1] = useState([
		{ id: "item-1-1", x: 0, y: 0, w: 2, h: 2 },
		{ id: "item-1-2", x: 2, y: 0, w: 2, h: 2 },
	])
	const [items2, setItems2] = useState([
		{ id: "item-2-1", x: 0, y: 0 },
		{ id: "item-2-2", x: 0, y: 1 },
		{ id: "item-2-3", x: 1, y: 0 },
	])

	return (
		<div>
			<div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
				<div></div>
			</div>

			<div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
				<button
					onClick={() =>
						setItems1((items) => [
							...items,
							{ id: `item-1-${Date.now()}`, x: 2, y: 0, w: 2, h: 2 },
						])
					}
				>
					Add Item to 1 grid
				</button>
				<button
					onClick={() =>
						setItems2((items) => [
							...items,
							{ id: `item-2-${Date.now()}`, x: 2, y: 0, w: 2, h: 2 },
						])
					}
				>
					Add Item to 2 grid
				</button>
				<button
					onClick={() =>
						setItems2((items) => [...items.filter((i) => i.id !== "item-2-1")])
					}
				>
					Remove Item to 2 grid
				</button>
			</div>
			<div style={{ display: "flex" }}>
				<div style={{ display: "flex", width: "50%" }}>
					<ControlledStack
						items={items1}
						addItem={(item) => {
							setItems1((items) => [...items, item])
						}}
						changeItems={(items) => setItems1(items)}
					/>
				</div>
				<div style={{ display: "flex", width: "50%" }}>
					<ControlledStack
						items={items2}
						addItem={(item) => {
							setItems2((items) => [...items, item])
						}}
						changeItems={(items) => setItems2(items)}
					/>
				</div>
			</div>
		</div>
	)
}

/*
const Builder = () => {
	const { grid, getItemRefFromListById } = useGridstackContext()
	const [displayItem1, setDisplayItem1] = React.useState<boolean>(true)
	const [displayItem2, setDisplayItem2] = React.useState<boolean>(false)
	const gridOptions: GridStackOptions = {
		column: 12,
		row: 12,
		alwaysShowResizeHandle: true,
		acceptWidgets: true,
		float: true,
		removable: true,
		itemClass: "grid-stack-item",
		staticGrid: false,
		animate: true,
		cellHeight: "100%",
		margin: 4,
		minRow: 5,
		resizable: {
			autoHide: true,
			handles: "se, sw",
		},
		draggable: {
			handle: "grid-stack-item-content",
			scroll: true,
		},
		placeholderClass: "grid-stack-placeholder-custom",
	}
	return (
		<>
			<div>
				<button
					type="button"
					onClick={() => {
						if (grid) {
							// Create a new div for the widget content
							const newItem = document.createElement("div")
							newItem.classList.add("grid-stack-item") // Ensure it has the appropriate GridStack item class

							const id = `item-${Math.floor(Math.random() * (100 - 1 + 1)) + 1}`
							const options: GridStackWidget = {
								h: 1,
								w: 1,
								autoPosition: true,
								noResize: false,
								maxH: 4,
								maxW: 1,
								noMove: true,
							}
							newItem.innerHTML = `<div>Test  ${
								Math.floor(Math.random() * (100 - 1 + 1)) + 1
							}</div>`
							/*
							newItem.innerHTML = `
								<GridstackItemComponent id="${id}">
									ITEM ${Math.floor(Math.random() * (100 - 1 + 1)) + 1}
								</GridstackItemComponent>
							`
							

							// Append the new item to the grid container
							grid.el.appendChild(newItem)

							// Make the item a gridstack widget with specific options
							grid.makeWidget(newItem)
							grid.update(newItem, {
								x: 0,
								y: 0,
								w: 1,
								h: 1,
							})
						}
					}}
				>
					Add widget
				</button>
				<button
					type="button"
					onClick={() => {
						if (grid?.getFloat()) {
							grid?.float(false)
						} else {
							grid?.float(true)
						}
					}}
					//!! THIS STILL DOESN'T WORK
				>
					{grid?.getFloat() ? "Deactivate" : "Activate"} float
				</button>

				<button
					type="button"
					onClick={() => {
						console.log(grid?.getGridItems())
						console.log("GRID", grid)
					}}
				>
					Console log grid Items
				</button>
				<button
					type="button"
					onClick={() => {
						setDisplayItem1((prev) => !prev)
					}}
				>
					{displayItem1 ? "Hide" : "Show"} Item 1
				</button>
				<button
					type="button"
					onClick={() => {
						setDisplayItem2((prev) => !prev)
					}}
				>
					{displayItem2 ? "Hide" : "Show"} Item 2
				</button>
			</div>

			<GridstackGrid
			// options={gridOptions}
			>
				{displayItem1 && (
					<GridstackItemComponent
						id="item1"
						initOptions={{ x: 0, y: 0, w: 1, h: 1 }}
					>
						<div>Item 1</div>
						<button
							type="button"
							onClick={() => {
								const itemRef = getItemRefFromListById("item1")
								if (itemRef?.current) {
									grid?.update(itemRef.current, { x: 1, w: 4, h: 4 })
								}
							}}
						>
							X = 3
						</button>
						<button
							type="button"
							onClick={() => {
								const itemRef = getItemRefFromListById("item1")
								if (itemRef?.current) {
									const xPosition = itemRef?.current.gridstackNode?.x
									console.log("ITEM REF CURRENT", itemRef.current)

									grid?.update(itemRef.current, {
										x: (xPosition ?? 0) + 1,
									})
								}
							}}
						>
							X + 1
						</button>
					</GridstackItemComponent>
				)}

				{displayItem2 && (
					<GridstackItemComponent id="item2">
						<div>Item 2</div>
					</GridstackItemComponent>
				)}
			</GridstackGrid>
		</>
	)
}
*/
