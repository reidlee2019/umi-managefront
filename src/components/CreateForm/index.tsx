/**
 * 公用的表单组件
 */
import React from 'react';
// import classNames from 'classnames';
// import { Form } from 'antd';


class CreateForm extends React.PureComponent {
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  }
  // 渲染formGroup
  // renderFormGroup(formConfig) {
  //   return formConfig.config.map(item => {
  //     if (item.options.hidden) {
  //       return ''
  //     }
  //     return this.renderFormItem(item, formConfig)
  //   })
  // }

  render() {
    // const { formConfig } = this.props;
    return (
      <div>
        12
      </div>
    )
  }
}

export default CreateForm
