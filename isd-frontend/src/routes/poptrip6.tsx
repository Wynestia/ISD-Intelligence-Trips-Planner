import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/poptrip6')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/poptrip6"!</div>
}
