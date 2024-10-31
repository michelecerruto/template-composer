import { GridStack } from "gridstack"
import React, { useEffect, useRef, useState } from "react"
import "gridstack/dist/gridstack.min.css"
import "./BasicGrid.css"

export const BasicGrid = () => {
	const [count, setCount] = useState(0)
	const [info, setInfo] = useState("")
	const [widgets, setWidgets] = useState([])

	const gridRef = useRef(null)
	const gridInstanceRef = useRef(null)
	const timerIdRef = useRef(null)

	useEffect(() => {
		if (!gridRef.current) {
			return
		}
		// Initialize GridStack
		const grid = GridStack.init(
			{
				float: true,
				cellHeight: "70px",
				minRow: 1,
			},
			gridRef.current,
		)

		grid.on("dragstop", (event, element) => {
			const node = element.gridstackNode
			setInfo(
				`You just dragged node #${node.id} to ${node.x},${node.y} – good job!`,
			)

			// Clear the info text after a two-second timeout
			window.clearTimeout(timerIdRef.current)
			timerIdRef.current = window.setTimeout(() => {
				setInfo("")
			}, 2000)
		})

		gridInstanceRef.current = grid

		return () => {
			// Clean up GridStack instance on unmount
			grid.destroy()
		}
	}, [])

	useEffect(() => {
		if (widgets.length > 0) {
			const lastWidget = widgets[widgets.length - 1]
			const el = gridRef.current.querySelector(
				`[data-gs-id="${lastWidget.id}"]`,
			)
			if (el) {
				gridInstanceRef.current.makeWidget(el)
			}
		}
	}, [widgets])

	const addNewWidget = () => {
		const node = {
			id: String(count),
			x: Math.round(12 * Math.random()),
			y: Math.round(5 * Math.random()),
			w: Math.round(1 + 3 * Math.random()),
			h: Math.round(1 + 3 * Math.random()),
			content: `ITEM ${count}`,
		}
		setCount(count + 1)
		setWidgets((prevWidgets) => [...prevWidgets, node])
	}

	return (
		<div>
			<button type="button" onClick={addNewWidget}>
				Add Widget
			</button>
			<h1>How to integrate GridStack.js with React.js</h1>
			<p>
				As with any virtual DOM-based framework, you need to ensure React has
				rendered the DOM (or any updates to it) <strong>before</strong> you
				initialize GridStack or call its methods. In this example, we use{" "}
				<code>makeWidget</code> to let React handle DOM rendering.
			</p>
			<p>
				If your app requires more complex render logic than the inline template
				in `addWidget`, consider&nbsp;
				<a href="https://github.com/gridstack/gridstack.js/tree/master/doc#makewidgetel">
					makeWidget
				</a>
				&nbsp;to let React deal with DOM rendering.
			</p>
			<div>{info}</div>
			<section className="grid-stack" ref={gridRef}>
				{widgets.map((widget) => (
					<div
						key={widget.id}
						className="grid-stack-item"
						data-gs-id={widget.id}
						data-gs-x={widget.x}
						data-gs-y={widget.y}
						data-gs-width={widget.w || 1}
						data-gs-height={widget.h || 1}
					>
						<div className="grid-stack-item-content">{widget.content}</div>
					</div>
				))}
			</section>
		</div>
	)
}
