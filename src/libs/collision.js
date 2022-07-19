const collision = (target, entities, colliedFn) => {
  const hasCollided = (target, entity) => {
    return !(
      target.offsetTop > entity.offsetTop + entity.offsetHeight ||
      target.offsetTop + target.offsetHeight < entity.offsetTop ||
      target.offsetLeft > entity.offsetLeft + entity.offsetWidth ||
      target.offsetLeft + target.offsetWidth < entity.offsetLeft
    )
  }

  // 遍历所有实体，判断是否与目标发生碰撞，发生碰撞则执行回调。
  entities.filter((entity) => !entity.collied).forEach(entity => {
    if (hasCollided(target, entity)) {
      colliedFn(target, entity)
    }
  })
}

export default collision
