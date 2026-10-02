const asset = { gifSrc: "/a.gif", staticSrc: "/a.png", width: 10, height: 20 }
const steps = [
  { command: "one --a", comment: "First step." },
  { command: "two 'b c'", comment: "Second step." },
]
const copy = {
  caption: "copy",
  copiedCaption: "copied",
  failureHint: "select the text and copy by hand.",
}
const copyLabel = (command: string): string => `copy command: ${command}`
const lowercaseLongDate = (isoDate: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${isoDate}T00:00:00Z`))
    .toLowerCase()

export type ParityCase = {
  readonly component: string
  readonly name: string
  readonly props: Record<string, unknown>
  readonly adoption?: Record<string, unknown>
}

export const parityCases: ReadonlyArray<ParityCase> = [
  { component: "button", name: "bare", props: {} },
  { component: "button", name: "labelled", props: { children: "Go" } },
  {
    component: "button",
    name: "class and type",
    props: { children: "Go", className: "extra", type: "button" },
  },
  {
    component: "button",
    name: "disabled",
    props: { children: "Go", disabled: true, "aria-label": "Go now" },
  },
  {
    component: "button",
    name: "outline xs",
    props: { children: "Go", variant: "outline", size: "xs" },
  },
  { component: "chevron-icon", name: "left", props: { direction: "left" } },
  { component: "chevron-icon", name: "right", props: { direction: "right" } },
  {
    component: "page-section",
    name: "plain",
    props: { id: "a", children: "x" },
  },
  {
    component: "page-section",
    name: "class",
    props: { id: "a", className: "mt-4 text-sm", children: "x" },
  },
  { component: "page-shell", name: "plain", props: { children: "x" } },
  {
    component: "section-heading",
    name: "plain",
    props: { number: "4", children: "Verify" },
  },
  {
    component: "shell-command",
    name: "flag",
    props: { command: "run --flag file" },
  },
  {
    component: "shell-command",
    name: "quoted",
    props: { command: "two 'b c' --flag=1" },
  },
  { component: "shell-command", name: "empty", props: { command: "" } },
  {
    component: "command-line",
    name: "plain",
    props: { command: "echo 'a b'" },
    adoption: { copy, copyLabel },
  },
  {
    component: "copy-button",
    name: "initial",
    props: { text: "t", label: "copy item" },
    adoption: copy,
  },
  {
    component: "command-block",
    name: "plain",
    props: { id: "a", number: "1", title: "Verify", steps },
    adoption: { copy, copyLabel },
  },
  {
    component: "command-block",
    name: "copy all",
    props: { id: "a", number: "1", title: "Verify", steps, copyAll: true },
    adoption: {
      copy,
      copyLabel,
      copyAllCaption: "copy all",
      copyAllLabel: "copy all Verify commands",
    },
  },
  {
    component: "command-block",
    name: "note and lead",
    props: {
      id: "a",
      number: "2",
      title: "Verify",
      steps,
      note: "A note.",
      lead: <p>lead</p>,
    },
    adoption: { copy, copyLabel },
  },
  {
    component: "skip-link",
    name: "plain",
    props: {},
    adoption: { label: "skip to content" },
  },
  { component: "plate", name: "plain", props: { asset } },
  {
    component: "plate",
    name: "class",
    props: { asset, className: "w-24" },
  },
  {
    component: "plate-header",
    name: "class",
    props: { asset, plateClassName: "w-[245px]" },
  },
  {
    component: "plate-header",
    name: "no class",
    props: { asset, plateClassName: "" },
  },
  {
    component: "status-page",
    name: "plain",
    props: {
      asset,
      plateClassName: "w-[245px]",
      heading: "Heading",
      children: "Body",
      actions: <a href="/">Back</a>,
    },
  },
  {
    component: "status-page",
    name: "rich",
    props: {
      asset,
      plateClassName: "",
      heading: <em>Rich</em>,
      children: <strong>Body</strong>,
      actions: null,
    },
  },
  { component: "page-title", name: "title only", props: { title: "About" } },
  {
    component: "page-title",
    name: "dated",
    props: { title: "About", lastChangedAt: "2026-10-01T12:00:00+03:00" },
    adoption: {
      changedLabel: "site last changed",
      formatDate: lowercaseLongDate,
    },
  },
]
