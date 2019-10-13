/**
 * 公用的表单组件
 */
import React from 'react';
import { Form } from 'antd';
import classNames from 'classnames';
import { GlobalState } from '@/models/connect';
import Case from './Case';
import connectFn from '@/utils/connectFn';
import { FormComponentProps } from 'antd/es/form';

interface CreateFormProps {
  formConfig?: any;
  form: FormComponentProps['form'];
}

@connectFn()
class CreateForm extends React.PureComponent<CreateFormProps, GlobalState> {
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  renderFormItem(item: any) {
    const { formConfig } = this.props;
    return Case(item, formConfig, this);
  }

  // 渲染formGroup
  renderFormGroup = () => {
    const { formConfig } = this.props;
    return formConfig.config.map((item: any) => {
      if (item.options.hidden) {
        return ''
      }
      return this.renderFormItem(item)
    })
  };

  render() {
    const { formConfig } = this.props;
    let formItemLayout = formConfig.formItemLayout || {};
    if (formConfig.isPop) {
      formItemLayout = formConfig.formItemLayout ? formConfig.formItemLayout : this.formItemLayout;
    }
    return (
      <div className={classNames({
        'm-form': !formConfig.isPop && !formConfig.className,
        'm-form-pop': formConfig.isPop && !formConfig.className,
      })}>
        <Form
          layout={formConfig.layout || 'inline'}
          {...formItemLayout}
        >
          {this.renderFormGroup()}
        </Form>
      </div>
    )
  }
}

export default Form.create<CreateFormProps>({ name: 'create-form' })(CreateForm);
