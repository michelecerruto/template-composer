import { ResizableSidebar } from "@octostar/platform-react"
import React from "react"
import { Layout, Tooltip, Typography } from "antd"
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons"
import { ControlledStackSidebar } from "./ControlledGrid"
import "./LeftSidebar.css"
import { useGridstackContext } from "./Gridstack/GridstackContext"

const { Sider } = Layout

export default function LeftSidebar() {
	const [collapsed, setCollapsed] = React.useState<boolean | undefined>()
	const { itemsSidebar } = useGridstackContext()
	console.log("TEST itsmSidebar", itemsSidebar)
	return (
		<ResizableSidebar
			id="octostar:sidebar:templateComposer"
			minWidth={200}
			initialWidth={200}
			enable={!collapsed}
		>
			{(width) => (
				<Sider
					width={width}
					key="template-composer-sidebar"
					className="template-composer-sidebar"
					theme="light"
					collapsed={collapsed}
					collapsedWidth={48}
				>
					{collapsed ? (
						<div className="template-composer-sidebar-closed">
							<span
								role="button"
								tabIndex={0}
								className="template-composer-sidebar-closed"
								onClick={() => setCollapsed(!collapsed)}
							>
								<Tooltip placement="right" title="Widgets">
									<DoubleRightOutlined className="template-composer-sidebar-icon" />
								</Tooltip>
							</span>
						</div>
					) : (
						<div className="template-composer-sidebar-opened">
							<Typography.Title
								style={{
									height: "35px",
								}}
								level={5}
							>
								Widgets
							</Typography.Title>
							<span
								role="button"
								tabIndex={0}
								className="template-composer-sidebar-opened"
								onClick={() => setCollapsed(!collapsed)}
							>
								<Tooltip placement="right" title="Close sidebar" zIndex={4000}>
									<DoubleLeftOutlined className="template-composer-sidebar-icon" />
								</Tooltip>
							</span>
						</div>
					)}
					{!collapsed && (
						<div
							style={{
								display: "flex",
								width: "auto",
								padding: "16px",
								overflowX: "hidden",
								overflowY: "auto",
								backgroundColor: "white",
							}}
						>
							<ControlledStackSidebar key="1" items={itemsSidebar} />
						</div>
					)}
				</Sider>
			)}
		</ResizableSidebar>
	)
}
