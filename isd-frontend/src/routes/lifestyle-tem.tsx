import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lifestyle-tem')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lifestyle-tem"!</div>
}
