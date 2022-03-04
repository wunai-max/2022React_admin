import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api';
import { constants } from '../../utils/constants';

//用于图片上传

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {

    constructor(props) {
        super(props);
        let fileList = []
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己唯一的id
                name: img, // 图片文件名
                status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                url:constants.BASE_IMG_URL + img
            }))
        }

        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: fileList,
        }
    }

    //获取上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log('>>>>file',file);
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    // file 当前操作的文件对象。
    // fileList 当前的文件列表。
    handleChange = async ({ file, fileList }) => {
        // console.log('handleChange', file, fileList.length, file === fileList[fileList.length - 1]);
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('图片上传成功！')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]  //重新赋值
                file.name = name;
                file.url = url;
            } else {
                message.error('图片上传失败')
            }
        } else if (file.status === 'removed') { //删除
            const res = await reqDeleteImg(file.name)
            if (res.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"
                    accept={'image/*'}
                    name='image' /*请求参数名*/
                    listType="picture-card"
                    fileList={fileList} //已上传图片的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
