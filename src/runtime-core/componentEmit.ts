import { camelize, toHandlerkey } from "../shared";

export function emit(instance, event, ...args) {
  console.log(instance);
  console.log(event);
  console.log(args);
  
  // instance.props -> event
  const { props } = instance

  // TPP
  // 先去写一个特定的行为 -》 重构成通用的行为F
  // add ->  Add
  // add-foo -> addFoo
  const HandlerName = toHandlerkey(camelize(event))
  const handler = props[HandlerName]
  handler && handler(args)
}