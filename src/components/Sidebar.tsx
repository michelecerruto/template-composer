import React from "react"
import {
	AppstoreAddOutlined,
	CloseOutlined,
	MenuUnfoldOutlined,
	SettingOutlined,
} from "@ant-design/icons"
import { Button, Layout, Menu } from "antd"
import { ControlledStackSidebar } from "./ControlledGrid"

const { Sider } = Layout

export const Sidebar = () => {
	const [collapsed, setCollapsed] = React.useState(false)
	const [menu, setMenu] = React.useState("templates")
	const [items, setItems] = React.useState([
		{
			id: "PersonCard",
			templateName: "PersonCard",
			x: 0,
			y: 0,
			w: 8,
			h: 8,
			autoPosition: true,
		},
		{
			id: "PersonCard",
			templateName: "PersonCard",
			x: 0,
			y: 0,
			w: 8,
			h: 8,
			autoPosition: true,
		},
		{
			id: "PersonCard",
			templateName: "PersonCard",
			x: 0,
			y: 0,
			w: 8,
			h: 8,
			autoPosition: true,
		},
		{
			id: "PersonCard",
			templateName: "PersonCard",
			x: 0,
			y: 0,
			w: 8,
			h: 2,
			autoPosition: true,
		},
		{
			id: "PersonCard",
			templateName: "PersonCard",
			x: 0,
			y: 0,
			w: 8,
			h: 2,
			autoPosition: true,
		},
		{
			id: "OsThingCard",
			templateName: "OsThingCard",
			x: 2,
			y: 0,
			w: 4,
			h: 8,
			autoPosition: true,
		},
	])

	return (
		<Sider
			trigger={null}
			collapsible
			collapsed={collapsed}
			collapsedWidth={64}
			style={{
				backgroundColor: "white",
				overflowX: "hidden",
				border: "1px solid #f0f0f0",
				color: "black",
				overflow: "auto",
				height: "100vh",
				position: "fixed",
				insetInlineStart: 0,
				top: 0,
				zIndex: 1,
				bottom: 0,
				scrollbarWidth: "thin",
				scrollbarGutter: "stable",
			}}
		>
			<div style={{ height: "54px" }}>
				{collapsed ? (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Button
							type="text"
							onClick={() => setCollapsed(!collapsed)}
							style={{
								width: 48,
								height: 48,
							}}
							icon={<MenuUnfoldOutlined />}
						/>
					</div>
				) : (
					<div>
						<div
							style={{
								display: "flex",
								width: "100%",
								justifyContent: "space-between",
								alignItems: "center",
								fontSize: "18px",
								paddingLeft: "16px",
								fontWeight: "500",
							}}
						>
							Options
							<Button
								type="text"
								onClick={() => setCollapsed(!collapsed)}
								style={{
									display: "flex",
									width: 48,
									height: 48,
								}}
								icon={<CloseOutlined />}
							/>
						</div>
					</div>
				)}
			</div>

			<Menu
				theme="light"
				mode="inline"
				defaultSelectedKeys={[menu]}
				items={[
					{
						key: "templates",
						icon: <AppstoreAddOutlined />,
						label: "Templates",
						onClick: () => setMenu("templates"),
					},
					{
						key: "settings",
						icon: <SettingOutlined />,
						label: "Settings",
						onClick: () => setMenu("settings"),
					},
				]}
			/>
			{collapsed || menu !== "templates" ? null : (
				<div
					style={{
						display: "flex",
						width: "auto",
						margin: "16px",
						overflowX: "hidden",
						overflowY: "auto",
					}}
				>
					<ControlledStackSidebar key="1" items={items} />
				</div>
			)}
		</Sider>
	)
}
