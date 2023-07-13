import {TreeView, TreeItem} from "@mui/lab";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Componente TreeViewItem
function TreeViewItem({item}) {
	return (
		<TreeItem
			key={item.id}
			nodeId={item.id}
			label={item.label}
			onClick={item.onClick}
		>
			{item.subItems &&
				item.subItems.length > 0 &&
				item.subItems.map((subItem) => (
					<TreeViewItem
						key={subItem.id}
						item={subItem}
					/>
				))}
		</TreeItem>
	);
}

export function TreeViewComp({menuItem}) {
	return (
		<TreeView
			defaultCollapseIcon={<ExpandMoreIcon />}
			defaultExpandIcon={<ChevronRightIcon />}
		>
			<TreeViewItem item={menuItem} />
		</TreeView>
	);
}
