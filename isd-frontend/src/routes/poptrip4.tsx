import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/poptrip4')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/poptrip4"!</div>
}
