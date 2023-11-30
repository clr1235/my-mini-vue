export {createApp} from './createApp'
export {h} from './h'
export {renderSlots} from './helpers/renderSlots'


/**
 * 实现一个component的流程：
 * 根据vue3的官方文档知道，一个应用是从createApp()创建一个应用实例app开始，接着需要将创建的应用进行挂载
 * 1、实现createApp(rootComponent, [传递给根组件的props])，返回一个带有mount方法的对象；
 * 2、在mount(rootContainer)中，调用createVNode(rootComponent)先将传入的根组件转为虚拟vnode，然后调用render(vnode, container)进行渲染；
 * 4、实现render(vnode, container)，在方法内调用patch(vnode, container)；
 * 5、patch方法内部判断vnode是一个Elment还是Component，分别进行不通的处理;
 * 6、此处我们实现Component，在patch内部调用processComponent(vnode, container)；
 * 7、processComponent方法内部进行组件挂载，即调用mountComponent(vnode, container)；
 * 8、mountComponent方法内部，先调用createComponentInstance(vnode)方法，创建组件实例；
 * 9、然后调用setupComponent(instance)、setupRenderEffect(instance, container)；
 * 
 * 
 * 
 * 
 * 
 */