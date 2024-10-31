import React from "react"
import "./StaticGrid.css"

const Item = ({ id }: any) => <div>{id}</div>

export const StaticGrid = ({ items }: { items: any[] }) => {
	console.log("STATIC GRID ITEMS", items)
	return (
		<div className="grid-container">
			{items.map((item) => (
				<div
					key={item.id}
					className="grid-item"
					style={{
						gridColumnStart: item.x + 1,
						gridColumnEnd: item.x + item.w + 1,
						gridRowStart: item.y + 1,
						gridRowEnd: item.y + item.h + 1,
					}}
				>
					<Item id={item.id} />
				</div>
			))}
		</div>
	)
}
