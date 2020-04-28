import React, { useEffect, useState } from 'react'
import FeedHeader from './components/FeedHeader'
import FeedEntries from './components/FeedEntries'
import styles from './style.less'
import { fetchEntriesByTitleId, fetchTitle, getAverageTitleRate, updateTitle } from '@/services/api'
import { PageLoading } from '@ant-design/pro-layout'
import { useSelector } from 'react-redux'
import { handleArrayFiltering, forgeDataTree } from '@/services/utils'
import { TreeSelect, Modal, Form, Input, Button, Popconfirm, message, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const Feed: React.FC = ({ computedMatch }): JSX.Element => {
	const categoryList = useSelector((state: any) => state.global.categoryList)
	const accessToken = useSelector((state: any) => state.global.accessToken)
	const userRole = useSelector((state: any) => state.user?.attributes.user.role)

	const [form] = Form.useForm()

	const [title, setTitle]: any = useState(null)
	const [averageTitleRate, setAverageTitleRate] = useState(null)
	const [category, setCategory]: any = useState(null)
	const [categoryTree, setCategoryTree] = useState([])
	const [entryList, setEntryList]: any = useState(null)
	const [updateModalVisibility, setUpdateModalVisibility] = useState(false)

	const handleEntryFetching = (page: number): void => {
		fetchEntriesByTitleId(title.attributes.id, page).then(res => {
			setEntryList(res.data.attributes)
		})
	}

	const getTitleRate = async (titleId: string): Promise<void> => {
		await getAverageTitleRate(titleId).then(res => setAverageTitleRate(res.data.attributes.rate || 0))
	}

	const handleTitleUpdate = async (values: { categoryId: string, name: string }): Promise<void> => {
		await updateTitle(accessToken, title.attributes.id, values)
			.then(_res => {
				location.href = `/feeds/${_res.data.attributes.slug}`
			})
			.catch(error => message.error(error.response.data.message))
	}

	useEffect(() => {
		setCategoryTree(forgeDataTree(categoryList))
		fetchTitle(computedMatch.params.feedSlug, 'slug').then(async res => {
			setCategory(handleArrayFiltering(categoryList, res.data.attributes.category_id))
			getTitleRate(res.data.attributes.id)
			fetchEntriesByTitleId(res.data.attributes.id, 0).then(res => {
				setEntryList(res.data.attributes)
			})
			await setTitle(res.data)
		})
	}, [])

	if (!entryList || !title || !category || (!averageTitleRate && averageTitleRate !== 0)) return <PageLoading />

	return (
		<>
			<FeedHeader
				accessToken={accessToken}
				styles={styles}
				openUpdateModal={(): void => setUpdateModalVisibility(true)}
				userRole={userRole}
				titleData={title}
				categoryData={category}
				averageTitleRate={averageTitleRate}
				refreshTitleRate={getTitleRate}
			/>
			<FeedEntries
				accessToken={accessToken}
				entryList={entryList}
				titleData={title}
				handleEntryFetching={handleEntryFetching}
				setEntryList={setEntryList}
			/>
			<Modal
				transitionName='fade'
				centered
				visible={updateModalVisibility}
				closable={false}
				width='300px'
				footer={null}
				onCancel={(): void => setUpdateModalVisibility(false)}
			>
				<Form
					onFinish={handleTitleUpdate}
					form={form}
					initialValues={{
						name: title.attributes.name,
						categoryId: category.id
					}}
				>
					<Form.Item
						name="categoryId"
						style={{ marginBottom: 10 }}
						rules={[{ required: true, message: 'Please select category' }]}
					>
						<TreeSelect style={{ width: '100%' }} placeholder="Electronic" allowClear>
							{categoryTree.map((data: any) => (
								<TreeSelect.TreeNode key={data.id} value={data.id} title={data.name}>
									{data.childNodes.map((child: any) => (
										<TreeSelect.TreeNode key={child.id} value={child.id} title={child.name} />
									))}
								</TreeSelect.TreeNode>
							))}
						</TreeSelect>
					</Form.Item>
					<Form.Item
						name="name"
						style={{ marginBottom: 10 }}
						rules={[{ required: true, message: 'Please fill the input above' }]}
					>
						<Input placeholder="Title Name" />
					</Form.Item>
					<div style={{ textAlign: 'center' }}>
						<Popconfirm
							placement="bottom"
							style={{ fontSize: 15 }}
							icon={<InfoCircleOutlined style={{ color: 'red' }} />}
							title="Are you sure that you want to update this feed?"
							onConfirm={(): void => form.submit()}
							okText="Yes"
							cancelText="No"
						>
							<Button style={{ width: '100%' }} type="primary">
								OK
							</Button>
						</Popconfirm>
					</div>
				</Form>
			</Modal>
			<br/>
		</>
	)
}

export default Feed