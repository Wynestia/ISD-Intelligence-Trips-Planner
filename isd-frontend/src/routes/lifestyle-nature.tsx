import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lifestyle-nature')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lifestyle-nature"!</div>
}
