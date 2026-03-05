import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lifestyle-festive')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lifestyle-festive"!</div>
}
