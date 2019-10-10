/**
 * 公用的表单组件
 */
import React from 'react';
import { Form } from 'antd';
import classNames from 'classnames';
import connectFn from '@/utils/connectFn';
import CreateDrawer from '@/components/CreateDrawer';
import { StateType } from '@/common-typings';
import { types } from '@/utils/utils';
import Selector from './Selector';
import { FormComponentProps } from 'antd/es/form';

interface CreateFormProps {
  formConfig: {
    config: any[];
    rules?: any[];
    layout?: string;
    className?: string;
    isPopup?: boolean;
    formItemLayout?: any;
    requestList?: Function;
    [propName: string]: any;
  };
  form: FormComponentProps['form'];
}

// let isFormChange = false;

const createFormField = (value: any) => Form.createFormField({ value });


@connectFn()
@CreateDrawer
class CreateForm extends React.PureComponent<CreateFormProps> {
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

  // 清空searchform内的状态
  clearFormState = () => {
    const { config, changeSearchFormState, requestList } = this.props.formConfig;
    const newConfig = config.map(item => {
      if (item.options.hasOwnProperty('value') && !item.options.noClear) {
        if (types(item.options.value) === 'string' && item.options.value !== '') {
          item.options.value = ''
        }
        if (types(item.options.value) === 'number') {
          item.options.value = ''
        }
        if (types(item.options.value) === 'array' && item.options.value.length) {
          item.options.value = []
        }
        // 如果formItem设置有默认值，则赋予默认值
        if (item.options.defaultValue) {
          item.options.value = item.options.defaultValue;
        }
      }
      return item
    });

    if (changeSearchFormState) changeSearchFormState({ config: newConfig }, requestList, true);
  };

  beforeSearchCallBack = (key: string, data: StateType) => {
    const {
      formConfig,
      beforeCloseCallBack,
      // changeSearchFormState,
      closeDrawer,
      form,
    }: any = this.props;

    // 重置时，清空数据
    if (key === 'reset') {
      this.clearFormState();
    // 如果是弹窗
    } else if (formConfig.isPopup) {
      form.validateFields((error: any) => {
        if (!error) {
          beforeCloseCallBack('confirm')
        }
      })
    // 如果是查询
    } else if (key === 'submit') {
      form.validateFields((error: any, value: {}) => {
        if (!error) {
          // 清除去"|"的默认值
          Object.keys(value).map(valueKey => {
            if (types(value[valueKey]) === 'string' && value[valueKey].indexOf('|') > -1) {
              delete value[valueKey]
            }
            return valueKey
          });
          console.log(value)
          formConfig.requestList(value);
          // if(isFormChange) { // form内参数有变化
          //   changeSearchFormState({}, formConfig.requestList, true, value);
          // }else{
          //   formConfig.requestList(value)
          // }
        }
      })
    }
    if (closeDrawer) closeDrawer();
  };

  assignFormData = () => {
    const { formConfig } = this.props;
    const result = {};
    if (formConfig && formConfig.config) {
      formConfig.config.map(item => {
        if (item.options.hasOwnProperty('value')) {
          if (types(item.options.value) === 'array') {
            if (item.options.value.length) {
              if (item.options.hasOwnProperty('format')) {
                const { format, value } = item.options;
                result[format[0]] = value[0];
                result[format[1]] = value[1];
              } else {
                result[item.id] = item.options.value
              }
            }
          } else if (item.options.value !== '' && item.options.value !== null) {
            result[item.id] = item.options.value
          }
        }
        return item
      })
    }
    return result
  };

  // 渲染formItem
  renderFormItem(item: StateType, formConfig: StateType) {
    return Selector(item, formConfig, this);
  }

  // 渲染formGroup
  renderFormGroup() {
    const { formConfig } = this.props;
    return formConfig.config.map((item: StateType) => {
      if (item.options.hidden) {
        return '';
      }
      return this.renderFormItem(item, formConfig);
    });
  }

  render() {
    const { formConfig } = this.props;
    let formItemLayout = formConfig.formItemLayout || {};
    if (formConfig.isPopup) {
      formItemLayout = formConfig.formItemLayout || this.formItemLayout;
    }
    return (
      <div
        className={classNames({
          'st-form': !formConfig.isPopup && !formConfig.className,
          'st-form-pop': formConfig.isPopup && !formConfig.className,
        })}
      >
        <Form
          layout={formConfig.layout || 'inline'}
          onSubmit={this.beforeSearchCallBack}
          {...formItemLayout}
        >
          {this.renderFormGroup()}
        </Form>
      </div>
    );
  }
}

export default Form.create<CreateFormProps>({
  mapPropsToFields(props: StateType) {
    const { formConfig } = props;
    const propFormObj = {};
    formConfig.config.map((item: StateType) => {
      if (item.options.hasOwnProperty('value')) {
        const itemValue = item.options.value;
        if (types(itemValue) === 'string' && itemValue !== '') {
          propFormObj[item.id] = createFormField(itemValue);
        }
        if (types(itemValue) === 'number') {
          propFormObj[item.id] = createFormField(itemValue);
        }
        if (types(itemValue) === 'array' && itemValue.length) {
          propFormObj[item.id] = createFormField(itemValue);
        }
      }
      return item;
    });
    return propFormObj;
  },
  onValuesChange(props: StateType, values) {
    // console.log(values, props);
    // const { formConfig } = props;
    // const config = [...formConfig.config];

    // let newConfig;
    // Object.keys(values).map(key => {
    //   const value = values[key];
    //   newConfig = config.map(item => {
    //     if (item.id === key) {
    //       if (item.options.defaultValue && !value) {
    //         item.options.value = item.options.defaultValue;
    //       } else {
    //         item.options.value = value;
    //       }
    //     }
    //     return item;
    //   });
    //   return key;
    // });
    // console.log(newConfig);
    // isFormChange = true;
    // changeSearchFormState({ config: newConfig });
  },
})(CreateForm);
