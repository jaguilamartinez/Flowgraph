/**
 * Flowgraph AI design system — public API.
 *
 * Feature code imports from this barrel only; component internals and
 * CSS modules are private. Tokens live in `tokens/index.css` and are
 * imported once by the root layout.
 */

// Shared vocabulary
export { cx } from "./lib/cx";
export { StatusIcon, type Status } from "./lib/status";

// Actions
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from "./components/button/Button";
export { IconButton, type IconButtonProps } from "./components/button/IconButton";
export { Link, type LinkProps } from "./components/link/Link";

// Forms
export {
  ErrorText,
  FormField,
  HelpText,
  Label,
  useFormField,
  type FormFieldProps,
  type LabelProps,
} from "./components/form-field/FormField";
export { Input, type InputProps } from "./components/text-input/Input";
export { Textarea, type TextareaProps } from "./components/text-input/Textarea";
export { NumberField, type NumberFieldProps } from "./components/text-input/NumberField";
export { UnitInput, type UnitInputProps } from "./components/text-input/UnitInput";
export {
  Select,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  type SelectItemProps,
  type SelectProps,
} from "./components/select/Select";
export { Combobox, type ComboboxOption, type ComboboxProps } from "./components/combobox/Combobox";
export { Checkbox, type CheckboxProps } from "./components/selection/Checkbox";
export { Radio, RadioGroup, type RadioGroupProps, type RadioProps } from "./components/selection/RadioGroup";
export { Switch, type SwitchProps } from "./components/selection/Switch";

// Overlays
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  type DialogContentProps,
} from "./components/dialog/Dialog";
export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  type AlertDialogContentProps,
} from "./components/dialog/AlertDialog";
export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  type PopoverContentProps,
} from "./components/popover/Popover";
export { Tooltip, TooltipProvider, type TooltipProps } from "./components/tooltip/Tooltip";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
} from "./components/menu/DropdownMenu";

// Navigation and structure
export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsContentProps,
  type TabsListProps,
  type TabsTriggerProps,
} from "./components/tabs/Tabs";
export { Accordion, AccordionItem, type AccordionItemProps, type AccordionProps } from "./components/disclosure/Accordion";
export { Collapsible, type CollapsibleProps } from "./components/disclosure/Collapsible";
export {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  type ToolbarProps,
  type ToolbarToggleGroupProps,
  type ToolbarToggleItemProps,
} from "./components/toolbar/Toolbar";

// Feedback and status
export { InlineAlert, type InlineAlertProps } from "./components/alert/InlineAlert";
export { Banner, type BannerProps } from "./components/alert/Banner";
export { StatusMessage, type StatusMessageProps } from "./components/alert/StatusMessage";
export { Badge, type BadgeProps } from "./components/status/Badge";
export { StatusIndicator, type StatusIndicatorProps } from "./components/status/StatusIndicator";
export { Progress, type ProgressProps } from "./components/status/Progress";
export { ToastProvider, useToast, type ToastOptions } from "./components/toast/Toast";
export { Skeleton, type SkeletonProps } from "./components/skeleton/Skeleton";
export { EmptyState, type EmptyStateProps } from "./components/empty-state/EmptyState";
export { ErrorState, type ErrorStateProps } from "./components/empty-state/ErrorState";

// Data
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  type TableCellProps,
  type TableProps,
  type TableRowProps,
} from "./components/table/Table";
export { Tree, type TreeNode, type TreeProps } from "./components/tree/Tree";

// Layout and commands
export { SplitView, type SplitViewProps } from "./components/split-view/SplitView";
export {
  CommandPalette,
  type Command,
  type CommandPaletteProps,
} from "./components/command-palette/CommandPalette";
