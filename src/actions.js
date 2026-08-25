function emptyAction (...args) {
    console.warn('警告：提示当前使用的是空 Action')
}

class Actions {
    actions = {
        onGlobalStateChange: emptyAction,
        setGlobalState: emptyAction
    }
    setActions (actions) {
        this.actions = actions;
    }
    onGlobalStateChange (...args) {
        return this.actions.onGlobalStateChange(...args);
    }
    setGlobalState (...args) {
        return this.actions.setGlobalState(...args);
    }
}

const actions = new Actions();
export default actions;