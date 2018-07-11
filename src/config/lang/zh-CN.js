import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
export const message = {
    language: '语言',
    System: '虚拟地球',
    Login_Lable_Secret: "主密钥(12个助记词)",
    Login_Btn_Login: '确认',
    Login_Btn_Reset: '重置',
    Login_Btn_Reg: "新账户",
    Login_dialog_title: "创建主密码",
    Login_Btn_Login1: "登录",
    Login_Btn_Save: "保存并下载",
    Login_New_Info: "系统为您生成了足够安全的新密码，请点击【保存并下载】复制密码",
    Login_Confirm: "你尚未复制该密码,确认关闭",
    Login_AschLink: "阿希在线钱包",

    NavIndex: '首页',
    NavPerson: "主页",
    NavDapp: "USO兑换",
    NavLogin: "登录",
    NavLogOut: "退出",
    PerSonNav_Personal_Message: '个人信息',
    PerSonNav_Personal_Account: '我的账户',
    PerSonNav_Transaction: "转账",
    PersonNav_KongTou: "应用充值",
    PersonMessage_Address: "钱包地址",
    PersonMessage_Publick: "公钥",
    PersonMessage_Nickname: "昵称",

    account_header_first: "资产信息",
    account_header_second: "交易信息",
    account_table_currency: '资产',
    account_table_balance: '余额',
    account_table_operation: '操作',
    account_table_time: "时间",
    account_table_type_3: "内部转账",
    account_table_senderId: '发送者',
    account_table_amounts: '金额',
    account_table_recipientId: '接受者',
    account_table_t_type: '类型',
    account_table_t_oper_1: "提现",
    account_table_t_oper_2: "转账",
    account_table_t_oper_3: "充值",
    account_mine: "我",
    account_tooltip_withDraw: "提现到阿希链",
    account_tooltip_trans: "USO链内部转账",
    account_tooltip_Recharge: "充值到USO链",
    account_height: "高度",
    account_height_time: "时间",
    account_card_asset: "USO链资产",
    account_card_assetB: "阿希链资产",

    acount_form_title: "提现",
    acount_form_title1: "金额（手续费为0.1XAS）",
    acount_form_title2: "币种",
    acount_form_title4: "金额（手续费为0.1XAS（阿希链））",
    acount_form_btn_no: '取消',
    acount_form_btn_ok: '确定',
    acount_form_btn_disable_1: "秒",
    acount_form_error_asset_get_0: "金额必须大于零",
    acount_form_error_asset_Yue_lt: "币余额不足,须大于0.1",
    acount_form_error_asset_Yue_gt: "余额不足,应小于等于",
    account_form_error_WithDrawl_1: "余额不足",
    account_form_error_WithDrawl_2: "手续费不足",
    account_dialog_depose_title: "充值",
    account_dialog_depose_lable_second: "二级密码",
    error_nickname: '请输入昵称',
    error_secret: '请输入密码',
    error_secret_notformat: "密码格式不符合BIP39安全规范",
    error_amount_gt0: "金额必须大于0",
    error_pass: "请输入8到16位数字与字母组合",
    success_tixian: "已提现",
    success_ChangeNickName: '昵称已改变',
    alert_ok: "转账成功",

    trs_form_field_address: "地址(应用内部转账)",
    trs_form_input_placeholder: "请输入地址",
    trs_form_field_currency: "资产",
    trs_form_input_2_placeholder: "请选择资产",
    trs_form_field_amount: "金额(手续费 0.1 ubiquity.USO)",
    trs_form_input_3_placeholder: "请输入金额",
    trs_form_btn: "转账",
    trs_error_Address_NotNull: "地址不能为空",
    trs_error_Address_NotInteger: "地址不能为数字",
    trs_error_Address_NotOk: "地址不正确",
    trs_error_Amount_IsNumber: "金额为数字",
    trs_error_Amount_IsGt0: "金额必须大于零",
    trs_info_1: "转账成功",
    trs_info_2: "余额不足",

    Kongtou_form_field_address: "USO地址",
    Kongtou_form_input_placeholder: "请输入USO地址",
    Kongtou_form_field_currency: "以太坊地址",
    Kongtou_form_input_2_placeholder: "请输入以太坊地址",
    Kongtou_form_field_amount: "签名信息",
    Kongtou_form_input_3_placeholder: "请输入签名信息",
    Kongtou_form_btn: "绑定",
    Kongtou_error_Address_NotNull: "USO地址不能为空",
    Kongtou_error_Address_NotInteger: "USO地址错误",
    Kongtou_error_ETH_NotNull: "以太坊地址不为空",
    KongTou_error_Sign_notNull: "签名信息不能为空",
    KongTpu_error_Sign_notJson: "签名信息错误",
    KongTou_info_1: "绑定成功",
    KontTou_error_Address_distinct: "该地址已绑定",
    KontTou_info_Confirm: "你的登录地址和绑定地址不一样，是否继续绑定",
    KongTou_info_Confirm_1: "提示",
    KongTou_info_Confirm_2: "确定",
    KongTou_info_Confirm_3: "取消",
    Nav_log: "USO 钱包",
}
export default {
    message: message,
    ...zhLocale
}