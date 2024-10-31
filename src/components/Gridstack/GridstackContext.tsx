import { GridStack } from "gridstack"
import React from "react"
import { ItemRefType } from "./GridstackItem"
import { SavedTemplate } from "@octostar/platform-types"
import { ItemTemplateBuilder } from "../../lib/types"

type ItemRefListType = {
	id: string
	ref: ItemRefType
}[]

type GridstackContextType = {
	entity: any | undefined
	setEntity: React.Dispatch<React.SetStateAction<any | undefined>>
	gridRef: React.MutableRefObject<GridStack | undefined>
	addItemRefToList: (id: string, ref: ItemRefType) => void
	removeItemRefFromList: (id: string) => void
	itemRefList: ItemRefListType
	getItemRefFromListById: (id: string) => ItemRefType | null
	templates: SavedTemplate[]
	setTemplates: React.Dispatch<React.SetStateAction<SavedTemplate[]>>
	itemsSidebar: ItemTemplateBuilder[]
	setItemsSidebar: React.Dispatch<React.SetStateAction<ItemTemplateBuilder[]>>
}

const GridstackContext = React.createContext<GridstackContextType | null>(null)

export const useGridstackContext = (): GridstackContextType => {
	const context = React.useContext(GridstackContext)
	if (!context) {
		throw new Error(
			"useGridstackContext must be used within a GridstackContextProvider",
		)
	}
	return context
}

export const GridstackProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [entity, setEntity] = React.useState<any | undefined>({
		age: 10,
		blood_type: "A+",
		build:
			"Testo di prova prova prova Di p prova prova prova prova PRovaTesto di prova prova prova Di p prova prova prova prova PRovaTesto di prova prova prova Di p prova prova prova prova PRovaTesto di prova prova prova Di p prova prova prova prova PRovaTesto di prova prova prova Di p prova prova prova prova PRovaTesto di prova prova prova Di p prova prova prova prova PRova",
		citizenship: "USA",
		city_of_birth: "Germany",
		complexion: null,
		concept_name: "person",
		country_of_birth: "Germany",
		date_of_birth: "1997-03-11",
		date_of_death: null,
		description: "",
		distinguishing_marks: "",
		entity_id: "8de9c6bb-5693-4717-b86e-c109cc91588b",
		entity_label: "Susan Wallace Anthony",
		entity_type: "person",
		first_name: "Susan",
		gender: "female",
		handedness: null,
		height: 157.86000061035156,
		last_name: "Wallace",
		main_language: "German",
		middle_name: "Anthony",
		os_concept: "person",
		os_created_at: "2024-09-12T08:40:55Z",
		os_created_by: "m.cerruto",
		os_deleted_at: null,
		os_deleted_by: null,
		os_entity_uid: "8de9c6bb-5693-4717-b86e-c109cc91588b",
		os_hidden_at: null,
		os_hidden_by: "",
		os_icon: null,
		os_last_updated_at: "2024-10-24T14:17:17Z",
		os_last_updated_by: "m.cerruto",
		os_textsearchfield: null,
		os_workspace: "cc60cecc-e67e-43a9-bfde-a3cd83812470",
		residence_address: "229 Jordan Centers Apt. 076, Tranview, MI 95402",
		residence_city: "Buffalo",
		residence_country: "USA",
		source_name: null,
		speaking_accent: null,
		weight: 60.66999816894531,
	})
	const [templates, setTemplates] = React.useState<SavedTemplate[]>([])
	const gridRef = React.useRef<GridStack | undefined>()
	const [itemRefList, setItemRefList] = React.useState<ItemRefListType>([])
	const [itemsSidebar, setItemsSidebar] = React.useState<ItemTemplateBuilder[]>(
		[],
	)
	const [itemsGi, setItems] = React.useState<ItemTemplateBuilder[]>([])

	const addItemRefToList = React.useCallback((id: string, ref: ItemRefType) => {
		setItemRefList((prev) => [...prev, { id, ref }])
	}, [])

	const removeItemRefFromList = React.useCallback((id: string) => {
		setItemRefList((prev) => prev.filter((item) => item.id !== id))
	}, [])

	const getItemRefFromListById = React.useCallback(
		(id: string) => {
			const item = itemRefList.find((item) => item.id === id)
			return item?.ref ?? null
		},
		[itemRefList],
	)

	React.useEffect(() => {
		if (!templates || templates.length === 0) {
			setItemsSidebar([])
			return
		}
		const newItems: ItemTemplateBuilder[] = []
		templates.forEach((template) => {
			const item: ItemTemplateBuilder = {
				templateName: template.name,
				id: template.os_entity_uid,
				x: 0,
				y: 0,
				w: 4,
				h: 4,
				// savedTemplate: template.template,
			}
			if (template.layout === "card") {
				item.w = 4
				item.h = 4
				item.layout = "card"
			}
			if (template.layout === "list") {
				item.w = 8
				item.h = 4
				item.layout = "list"
			}
			newItems.push(item)
		})
		setItemsSidebar(newItems)
	}, [templates])

	return (
		<GridstackContext.Provider
			value={{
				gridRef,
				entity,
				setEntity,
				addItemRefToList,
				removeItemRefFromList,
				itemRefList,
				getItemRefFromListById,
				templates,
				setTemplates,
				itemsSidebar,
				setItemsSidebar,
			}}
		>
			{children}
		</GridstackContext.Provider>
	)
}
