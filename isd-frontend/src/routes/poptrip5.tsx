import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/poptrip5')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/poptrip5"!</div>
}
