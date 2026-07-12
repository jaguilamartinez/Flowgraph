"use client";

import { useState } from "react";
import {
  Checkbox,
  Combobox,
  FormField,
  Input,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  SelectGroup,
  SelectItem,
  Switch,
  Textarea,
  UnitInput,
} from "@/design-system";
import { Grid, Section, Specimen, Stack } from "./specimen";

const catalogOptions = [
  {
    value: "apply_boundary_conditions",
    label: "Apply boundary conditions",
    description: "Processes · StructuralMechanicsApplication",
  },
  {
    value: "assign_material",
    label: "Assign material to model part",
    description: "Materials · Core",
  },
  {
    value: "linear_solver",
    label: "Linear solver settings",
    description: "Solvers · LinearSolversApplication",
  },
  {
    value: "output_vtk",
    label: "VTK output process",
    description: "Output · Core",
  },
  {
    value: "legacy_bc",
    label: "Legacy boundary condition",
    description: "Unsupported in Kratos 10.x",
    disabled: true,
  },
];

export function FormsSection() {
  const [material, setMaterial] = useState<string | undefined>("assign_material");

  return (
    <Section
      id="forms"
      title="Forms"
      description="Schema-driven editing: units as suffixes, required/optional markers, deterministic inline errors, monospace for technical values. FormField wires label, help, and error ids automatically."
    >
      <Grid>
        <Specimen label="Input — default, hint, error">
          <Stack>
            <FormField label="Node name" hint="Shown in the outline and diagnostics.">
              <Input placeholder="e.g. Inlet support" />
            </FormField>
            <FormField
              label="Model part"
              required
              error="A model part named “Structure.Inlet” does not exist in the attached MDPA."
            >
              <Input defaultValue="Structure.Inlet" mono />
            </FormField>
            <FormField label="Description" showOptional>
              <Input placeholder="Optional description" disabled />
            </FormField>
          </Stack>
        </Specimen>

        <Specimen label="Numeric and unit inputs" note="Values use tabular numerals so columns align.">
          <Stack>
            <FormField label="End time" hint="Total simulated time." required>
              <UnitInput unit="s" defaultValue="1.0" />
            </FormField>
            <FormField label="Time step" required>
              <NumberField defaultValue={0.01} step={0.005} min={0} unit="s" />
            </FormField>
            <FormField
              label="Young’s modulus"
              error="Must be greater than 0."
            >
              <UnitInput unit="MPa" defaultValue="-210000" />
            </FormField>
          </Stack>
        </Specimen>

        <Specimen label="Textarea">
          <Stack>
            <FormField label="Revision message" hint="Summarize what changed and why.">
              <Textarea placeholder="Refined mesh near the support and reduced the time step." rows={3} />
            </FormField>
          </Stack>
        </Specimen>

        <Specimen label="Select" note="For closed sets. Groups mirror the Kratos catalog structure.">
          <Stack>
            <FormField label="Solver type" required>
              <Select placeholder="Choose a solver" defaultValue="amgcl">
                <SelectGroup label="Iterative">
                  <SelectItem value="amgcl">AMGCL</SelectItem>
                  <SelectItem value="cg">Conjugate gradient</SelectItem>
                </SelectGroup>
                <SelectGroup label="Direct">
                  <SelectItem value="skyline_lu">Skyline LU factorization</SelectItem>
                  <SelectItem value="pardiso" disabled>
                    Pardiso (requires LinearSolversApplication)
                  </SelectItem>
                </SelectGroup>
              </Select>
            </FormField>
            <FormField label="Environment" hint="Changing the environment re-runs compatibility checks.">
              <Select placeholder="Kratos 10.4.3" disabled>
                <SelectItem value="10.4.3">Kratos 10.4.3</SelectItem>
              </Select>
            </FormField>
          </Stack>
        </Specimen>

        <Specimen
          label="Combobox"
          note="Filterable single select for large sets — the node catalog pattern. Matches titles and descriptions; disabled options stay visible with their reason."
        >
          <Stack>
            <FormField label="Add node" hint="Search by title, kind, or application.">
              <Combobox
                options={catalogOptions}
                value={material}
                onValueChange={setMaterial}
                placeholder="Search the node catalog"
              />
            </FormField>
          </Stack>
        </Specimen>

        <Specimen label="Checkbox, radio, switch">
          <Stack>
            <Checkbox
              label="Write restart files"
              description="Increases storage use per simulation."
              defaultChecked
            />
            <Checkbox label="Include warnings in report" checked="indeterminate" />
            <Checkbox label="Overwrite existing artifacts" disabled />
            <RadioGroup defaultValue="static" aria-label="Analysis type">
              <Radio value="static" label="Static" description="Loads applied without inertia." />
              <Radio value="dynamic" label="Dynamic" />
              <Radio value="modal" label="Modal" disabled />
            </RadioGroup>
            <Switch
              label="Compact density"
              description="Tighter rows and controls for large graphs."
            />
          </Stack>
        </Specimen>
      </Grid>
    </Section>
  );
}
