import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/poptrip3')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/poptrip3"!</div>
}
