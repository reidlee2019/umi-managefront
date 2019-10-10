import React from 'react';
import connectFn from '@/utils/connectFn';
import Mixins from '@/components/Common/mixin';
import CreateCard from '@/components/CreateCard';
import CreateForm from '@/components/CreateForm';

@connectFn([], ['getList'])
class Test extends Mixins {
  constructor(props: any) {
    super(props);
    this.state = {
      formConfig: {
        config: [
          {
            id: 'userName',
            type: 'input',
            options: {
              name: '账号',
              value: '',
              placeholder: '请输入账号',
            },
          },
          {
            id: 'submit',
            type: 'button',
            options: {
              name: '查询',
              type: 'primary',
            },
          },
          {
            id: 'reset',
            type: 'button',
            options: {
              name: '重置',
            },
          },
        ],
        requestList: this.requestList,
        changeSearchFormState: this.changeSearchFormState,
      },
    }
  }

  public requestList = () => {
    console.log(111, this.state);
  };

  render() {
    const { formConfig } = this.state;
    formConfig.changeSearchFormState = this.changeSearchFormState;
    return (
      <CreateCard>
        <CreateForm formConfig={ formConfig }/>
      </CreateCard>
    );
  }
}

export default Test;
