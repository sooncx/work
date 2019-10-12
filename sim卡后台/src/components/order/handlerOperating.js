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
    prodCode: {
        disabled: false,
        isShow: false
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
    exportOrderSimCard: {
        disabled: false,
        isShow: true
    },
    outType: {
        disabled: false,
        isShow: true
    },
    changeType: {
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
}

export function handlerOperating() {
    const orderStatus = this.defaultParams.orderStatus;
    const orderType = this.defaultParams.orderType; //this.defaultParams.orderType;

    //处理 待处理remark 和 已处理remark显示
    this.orderParams.remark =
        orderStatus === 4 ?
        this.defaultParams.yRemark :
        this.defaultParams.remark;

    switch (orderType) {
        case 1: //卡订单
            this.isOperating = {
                userCode: {
                    disabled: false,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 4 ? false : true,
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
                prodCode: {
                    disabled: false,
                    isShow: false
                },
                ifInstall: {
                    disabled: false,
                    isShow: true
                },
                sellType: {
                    disabled: orderStatus === 1 ? false : true,
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
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
                outType: {
                    disabled: false,
                    isShow: orderStatus === 4 ? true : false
                },
                changeType: {
                    disabled: false,
                    isShow: false
                },
                address: {
                    disabled: false,
                    isShow: true
                },
                assistantName: {
                    disabled: false,
                    isShow: true
                },
            };
            break;
        case 3:
            this.isOperating = {
                userCode: {
                    disabled: true,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 4 ? false : true,
                    isShow: false
                },
                serMeal: {
                    disabled: false,
                    isShow: false
                },
                orderPrice: {
                    disabled: true,
                    isShow: true
                },
                totalPrice: {
                    disabled: true,
                    isShow: false
                },
                sellStatus: {
                    disabled: true,
                    isShow: true
                },
                prodCode: {
                    disabled: false,
                    isShow: false
                },
                ifInstall: {
                    disabled: false,
                    isShow: false
                },
                sellType: {
                    disabled: false,
                    isShow: false
                },
                remark: {
                    disabled: false,
                    isShow: true
                },
                exYears: {
                    disabled: true,
                    isShow: true
                },
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
                outType: {
                    disabled: false,
                    isShow: false
                },
                changeType: {
                    disabled: false,
                    isShow: false
                },
                address: {
                    disabled: false,
                    isShow: false
                },
                assistantName: {
                    disabled: false,
                    isShow: false
                },
            };
            break;
        case 4: //套餐升级
            this.isOperating = {
                userCode: {
                    disabled: false,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 4 ? false : true,
                    isShow: true
                },
                serMeal: {
                    disabled: false,
                    isShow: false
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
                prodCode: {
                    disabled: false,
                    isShow: true
                },
                ifInstall: {
                    disabled: false,
                    isShow: false
                },
                sellType: {
                    disabled: true,
                    isShow: false
                },
                remark: {
                    disabled: false,
                    isShow: true
                },
                exYears: {
                    disabled: false,
                    isShow: false
                },
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
                outType: {
                    disabled: false,
                    isShow: false
                },
                changeType: {
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
            };
            break;
        default:
            this.isOperating = {
                userCode: {
                    disabled: false,
                    isShow: true
                },
                counts: {
                    disabled: orderStatus === 4 ? false : true,
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
                prodCode: {
                    disabled: false,
                    isShow: false
                },
                ifInstall: {
                    disabled: false,
                    isShow: false
                },
                sellType: {
                    disabled: false,
                    isShow: false
                },
                remark: {
                    disabled: false,
                    isShow: true
                },
                exYears: {
                    disabled: false,
                    isShow: false
                },
                exportOrderSimCard: {
                    disabled: false,
                    isShow: orderStatus === 1 ? true : false
                },
                outType: {
                    disabled: false,
                    isShow: false
                },
                changeType: {
                    disabled: false,
                    isShow: false
                },
                address: {
                    disabled: false,
                    isShow: true
                },
                assistantName: {
                    disabled: false,
                    isShow: true
                },
            };
            break;
    }
}