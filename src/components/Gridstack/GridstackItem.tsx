import React from "react"
import { useGridstackContext } from "./GridstackContext"
import { GridItemHTMLElement, GridStackWidget } from "gridstack"

export type ItemRefType = React.MutableRefObject<GridItemHTMLElement | null>
interface GridstackItemProps {
	initOptions?: GridStackWidget
	id: string
	children: React.ReactNode
	className?: string
}

/**
 * Component for rendering a grid item in a Gridstack layout.
 *
 * @component
 * @param {GridstackItemComponentProps} props - The component props.
 * @param {GridStackWidget} props.initOptions - The initial options for the grid item.
 * @param {string} props.id - The unique identifier for the grid item.
 * @param {ReactNode} props.children - The content to be rendered inside the grid item.
 * @param {string} props.className - The CSS class name for the grid item.
 * @returns {JSX.Element} The rendered grid item component.
 */
export const GridstackItemComponent = ({
	initOptions,
	id,
	children,
	className,
}: GridstackItemProps) => {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const optionsRef = React.useRef<GridStackWidget | undefined>(initOptions)
	const { grid, addItemRefToList, removeItemRefFromList } =
		useGridstackContext()
	const itemRef = React.useRef<GridItemHTMLElement | null>(null)

	// Update the optionsRef when initOptions changes
	React.useEffect(() => {
		optionsRef.current = initOptions
	}, [initOptions])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useLayoutEffect(() => {
		if (!grid || !containerRef.current) return
		if (grid && containerRef.current) {
			// Initialize the widget

			grid.batchUpdate(true)

			// Initialize the widget using makeWidget
			itemRef.current = containerRef.current
			grid.makeWidget(itemRef.current)

			if (optionsRef.current) {
				grid.update(itemRef.current, optionsRef.current)
			}

			grid.batchUpdate(false)
			addItemRefToList(id, itemRef)

			// Cleanup function to remove the widget
			return () => {
				if (grid && itemRef.current) {
					try {
						grid.batchUpdate(true)
						grid.removeWidget(itemRef.current, false)
						grid.batchUpdate(false)

						removeItemRefFromList(id)
					} catch (error) {
						console.error("Error removing widget", error)
						//! Doing nothing here is a bad practice, but we don't want to crash the app (Temporary fix)
						// Do nothing
					}
				}
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [grid])

	return (
		<div ref={containerRef} id="">
			<div className={`${className}`}>{children}</div>
		</div>
	)
}
