export let isOperating = {
    userCode: {
        disabled: false,
        isShow: true
    },
    counts: {
        disabled: false,
        isShow: true
    },
    serMeal: {
        disabled: false,
        isShow: true
    },
    orderPrice: {
        disabled: false,
        isShow: true
    },
    totalPrice: {
        disabled: true,
        isShow: true
    },
    sellStatus: {
        disabled: false,
        isShow: true
    },
    ifInstall: {
        disabled: false,
        isShow: true
    },
    sellType: {
        disabled: false,
        isShow: true
    },
    remark: {
        disabled: false,
        isShow: true
    },
    exYears: {
        disabled: false,
        isShow: true
    },
    changeType: {
        disabled: false,
        isShow: true
    },
    simPreview: {
        disabled: false,
        isShow: true
    },
    address: {
        disabled: false,
        isShow: true
    },
    assistantName: {
        disabled: false,
        isShow: true
    },
    exportOrderSimCard: {
        disabled: false,
        isShow: true
    },
}

export function handlerOperating() {
    const orderStatus = this.defaultParams.orderStatus;
    const orderType = this.defaultParams.orderType; //this.defaultParams.orderType
    //处理 待处理remark 和 已处理remark显示
    this.defaultParams.remark =
        orderStatus === 4 ?
        this.defaultParams.yRemark :
        this.defaultParams.remark;

    switch (orderType) {
        case 1:
            this.isOperating = {
                userCode: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                serMeal: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                orderPrice: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                totalPrice: {
                    disabled: true,
                    isShow: true
                },
                sellStatus: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                ifInstall: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                sellType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                remark: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                exYears: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                changeType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                simPreview: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                address: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                assistantName: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
            };
            break;
        case 3:
            this.isOperating = {
                userCode: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                serMeal: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                orderPrice: {
                    disabled:true,
                    isShow: true
                },
                totalPrice: {
                    disabled: true,
                    isShow: false
                },
                sellStatus: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                ifInstall: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                sellType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                remark: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                exYears: {
                    disabled: true,
                    isShow: true
                },
                changeType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                simPreview: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                address: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                assistantName: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
            };
            break;
        case 4:
            this.isOperating = {
                userCode: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                serMeal: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                orderPrice: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                totalPrice: {
                    disabled: true,
                    isShow: true
                },
                sellStatus: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                ifInstall: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                sellType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                remark: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                exYears: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                changeType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                simPreview: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                address: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                assistantName: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
            };
            break;
        default:
            this.isOperating = {
                userCode: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                serMeal: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                orderPrice: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                totalPrice: {
                    disabled: true,
                    isShow: true
                },
                sellStatus: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                ifInstall: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                sellType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                remark: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                exYears: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                changeType: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                simPreview: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: false
                },
                address: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                assistantName: {
                    disabled: orderStatus === 2 || orderStatus === 0 ? false : true,
                    isShow: true
                },
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
            };
            break;
    }
}