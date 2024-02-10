import React, {useEffect} from "react";
import {DatePicker, Form, Input, Modal, Select} from "antd";
import {ModalsProps} from "../../../../Model/Modal";
import {User} from "../../../../Model/User";
import {useDispatch, useSelector} from "react-redux";
import {editUser} from "../../../../Store/Users/Actions";
import moment from "moment";
import {AppState} from "../../../../Store/RootReducer";
import {hasAccess} from "../../../../Util/hasAccess";
import {inputRules} from "../../../../Util/config";

const {Option} = Select;

interface UserEditProps extends ModalsProps {
    user: User,
    tags: string[],
}

interface CustomTarget extends Node{
    title: string,
}

const UserEditModal: React.FC<UserEditProps> = (props: UserEditProps) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const authReducer = useSelector((state: AppState) => state.auth);

    useEffect(() => {
        const observer = new MutationObserver((mutations: MutationRecord[]) => {
            if (mutations.length >= 1 && mutations[0].target !== undefined) {
                const customTarget: CustomTarget = mutations[0].target as CustomTarget;
                if (customTarget.title !== undefined && customTarget.title !== null && customTarget.title) {
                    form.setFieldsValue({
                        expired_at: moment(customTarget.title),
                    });
                }
            }
        });

        const item = document.getElementById("expired_at");

        if (item) {
            observer.observe(item, {
                attributes: true,
            });
        }
    });

    useEffect(() => {
        form.setFieldsValue({
            tags: props.user.tags,
            role: props.user.role,
            name: props.user.name,
            token: props.user.token,
            email: props.user.email,
            expired_at: props.user.expired_at ? moment(props.user.expired_at) : null,
        });
    });

    const closeModal = () => {
        props.setVisible(false);

        // form.resetFields();
    };

    const formSubmitHandler = () => {
        let formValues = form.getFieldsValue();

        formValues = {
            ...formValues,
            expired_at: formValues.expired_at ? moment(formValues.expired_at)
                .format("YYYY-MM-DD HH:mm:ss") : null,
        };

        dispatch(editUser(props.user.id, formValues));

        closeModal();
    };


    return (
        <>
            <Modal
                forceRender={true}
                title="Edit user"
                visible={props.visible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={formSubmitHandler}
                    layout="vertical"
                >
                    {hasAccess(authReducer.user, "users.token") && (
                        <Form.Item label="Token" name="token" rules={inputRules}>
                            <Input placeholder="Token"/>
                        </Form.Item>
                    )}
                    <Form.Item label="Name" name="name" rules={inputRules}>
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item label="New Password" name="password">
                        <Input type="password" placeholder="password" />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={inputRules}>
                        <Select placeholder="Role">
                            {hasAccess(authReducer.user, "users.createRoot") && <Option value="root">root</Option>}
                            {hasAccess(authReducer.user, "users.createAdmin") && <Option value="admin">admin</Option>}
                            {hasAccess(authReducer.user, "users.createSeo") && <Option value="seo">seo</Option>}
                            {hasAccess(authReducer.user, "users.createUser") && <Option value="user">user</Option>}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tags" name="tags">
                        <Select mode="tags" allowClear placeholder="Tag">
                            {props.tags.map((tag: string, key: number) => (
                                <Option value={tag} key={key.toString(36)}>{tag}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={inputRules}>
                        <Input placeholder="email@example.com"/>
                    </Form.Item>
                    <Form.Item label="Expiration date" name="expired_at">
                        <DatePicker
                            placeholder="Account expire date"
                            style={{width: "100%"}}
                            showTime={true}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserEditModal;
