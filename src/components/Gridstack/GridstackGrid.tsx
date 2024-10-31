import React from "react"
import { useGridstackContext } from "./GridstackContext"
import { GridStack, GridStackOptions } from "gridstack"

export const GridstackGrid = ({
	children,
	options,
}: {
	children: React.ReactNode
	options?: GridStackOptions
}) => {
	const { grid, setGrid } = useGridstackContext()
	const containerRef = React.useRef<HTMLDivElement>(null)
	const optionsRef = React.useRef<any>(options)

	React.useEffect(() => {
		optionsRef.current = options
	}, [options])

	React.useLayoutEffect(() => {
		if (!grid && containerRef.current) {
			const gridInstance = GridStack.init(
				optionsRef.current,
				containerRef.current,
			)
			setGrid(gridInstance)
		}
		return () => {
			if (grid) {
				//? grid.destroy(false);
				grid.removeAll(false)
				grid.destroy(false)
				setGrid(null)
			}
		}
	}, [grid, setGrid])

	return <div ref={containerRef}>{children}</div>
}
