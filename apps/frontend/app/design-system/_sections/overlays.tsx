"use client";

import {
  Command as CommandIcon,
  Copy,
  Download,
  GitBranch,
  Info,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  Button,
  CommandPalette,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FormField,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  type Command,
} from "@/design-system";
import { Grid, Row, Section, Specimen } from "./specimen";

const paletteCommands: Command[] = [
  {
    id: "add-node",
    label: "Add node…",
    section: "Graph",
    icon: <Plus size={14} aria-hidden />,
    shortcut: "A",
  },
  {
    id: "focus-node",
    label: "Focus node…",
    section: "Graph",
    icon: <Search size={14} aria-hidden />,
  },
  {
    id: "validate",
    label: "Validate draft",
    section: "Project",
    shortcut: "⌘⇧V",
  },
  {
    id: "generate",
    label: "Generate configuration",
    section: "Project",
    disabled: true,
    disabledReason: "Draft has 2 validation errors",
  },
  {
    id: "create-revision",
    label: "Create revision…",
    section: "Project",
    icon: <GitBranch size={14} aria-hidden />,
  },
];

export function OverlaysSection() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <Section
      id="overlays"
      title="Overlays"
      description="Use modal surfaces for blocking tasks; keep routine editing in panels. Tooltips provide supplementary text, while constraints remain visible in the interface."
    >
      <Grid>
        <Specimen label="Dialog">
          <Row>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Rename project…</Button>
              </DialogTrigger>
              <DialogContent
                title="Rename project"
                description="Enter the name shown in project lists and revision headers."
                footer={
                  <>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="primary">Rename project</Button>
                    </DialogClose>
                  </>
                }
              >
                <FormField label="Project name" required>
                  <Input defaultValue="Cantilever beam study" />
                </FormField>
              </DialogContent>
            </Dialog>
          </Row>
        </Specimen>

        <Specimen
          label="AlertDialog"
          note="Destructive confirmation names the consequence. Focus lands on Cancel."
        >
          <Row>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="danger">Delete draft</Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                title="Delete draft?"
                description="Draft 12 and its unsaved changes will be permanently deleted. Published revisions are not affected."
                actionLabel="Delete draft"
                destructive
              />
            </AlertDialog>
          </Row>
        </Specimen>

        <Specimen label="Popover">
          <Row>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" iconStart={<Info size={14} aria-hidden />}>
                  Node details
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div style={{ display: "grid", gap: "var(--ds-space-1)" }}>
                  <strong>Static analysis stage</strong>
                  <span
                    style={{
                      fontFamily: "var(--ds-font-mono)",
                      fontSize: "var(--ds-text-sm)",
                      color: "var(--ds-text-secondary)",
                    }}
                  >
                    structural.static_analysis
                  </span>
                  <span style={{ color: "var(--ds-text-secondary)" }}>
                    Requires StructuralMechanicsApplication.
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          </Row>
        </Specimen>

        <Specimen label="Tooltip">
          <Row>
            <Tooltip content="Duplicate node">
              <IconButton label="Duplicate node" variant="secondary">
                <Copy size={16} aria-hidden />
              </IconButton>
            </Tooltip>
            <Tooltip content="Download artifact bundle" side="bottom">
              <IconButton label="Download artifact bundle" variant="secondary">
                <Download size={16} aria-hidden />
              </IconButton>
            </Tooltip>
          </Row>
        </Specimen>

        <Specimen label="DropdownMenu" note="Destructive items are visually separated and red.">
          <Row>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Revision actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>rev-0012</DropdownMenuLabel>
                <DropdownMenuItem icon={<GitBranch size={14} aria-hidden />}>
                  Create draft from revision
                </DropdownMenuItem>
                <DropdownMenuItem icon={<Copy size={14} aria-hidden />} shortcut="⌘D">
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem icon={<Download size={14} aria-hidden />}>
                  Export…
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Show in history</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<Trash2 size={14} aria-hidden />} destructive>
                  Delete revision…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </Specimen>

        <Specimen
          label="CommandPalette"
          note="Supports text filtering and arrow-key navigation. Disabled commands remain listed with the reason they are unavailable."
        >
          <Row>
            <Button
              variant="secondary"
              iconStart={<CommandIcon size={14} aria-hidden />}
              onClick={() => setPaletteOpen(true)}
            >
              Open command palette
            </Button>
          </Row>
          <CommandPalette
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            commands={paletteCommands}
          />
        </Specimen>
      </Grid>
    </Section>
  );
}
