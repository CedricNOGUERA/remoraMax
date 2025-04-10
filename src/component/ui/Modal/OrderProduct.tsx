import { Modal, Form, Row, Col, FloatingLabel, Button, ListGroup, Alert } from "react-bootstrap"
import { codeTarifTab, contenantTab, stockageData } from "../../../data/commandes/divers"
import { NomenclatureType } from "../../../definitions/NomenclatureType"
import { OrderDetailType, ProductDataType } from "../../../definitions/OrderType"
import { errorType } from "../../../definitions/errorType"

// interface AddProductModalType {
  
//     selectedProduct: ProductDataType
//     setSelectedProduct: React.Dispatch<React.SetStateAction<ProductDataType>>
//     showAddProductModal: boolean
//     handleCloseAddProductModal: () => void
//     handleSaveProductAdd: (e: React.FormEvent<HTMLFormElement>) => void
  
// }

// export function AddProductModal ({addProductModalProps}: {addProductModalProps: AddProductModalType}) {
//     const {selectedProduct, setSelectedProduct, showAddProductModal, handleCloseAddProductModal, handleSaveProductAdd} = addProductModalProps
//     return (
//     <Modal size='lg' show={showAddProductModal} onHide={handleCloseAddProductModal}>
//       <Form onSubmit={handleSaveProductAdd}>
//         <Modal.Header closeButton>
//           <Modal.Title>Ajouter un produit</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col xs={12} sm={6}>
//               <FloatingLabel controlId='Code Article' label='Code Article' className='mb-3'>
//                 <Form.Control
//                   placeholder='Code Article'
//                   type='text'
//                   value={selectedProduct?.detail_referenceExterne}
//                   onChange={(e) => {
//                     const referenceExterne = e.currentTarget.value
//                     setSelectedProduct((prevData: ProductDataType) => ({
//                       ...prevData,
//                       detail_referenceExterne: referenceExterne,
//                     }))
//                   }}
//                   required
//                 />
//               </FloatingLabel>
//             </Col>
//             <Col xs={12} sm={6}>
//               <FloatingLabel controlId='Désignation' label='Désignation' className='mb-3'>
//                 <Form.Control
//                   placeholder='Désignation'
//                   type='text'
//                   value={selectedProduct?.detail_description}
//                   onChange={(e) => {
//                     const description = e.currentTarget.value
//                     setSelectedProduct((prevData: ProductDataType) => ({
//                       ...prevData,
//                       detail_description: description,
//                     }))
//                   }}
//                   required
//                 />
//               </FloatingLabel>
//             </Col>
//             <Col xs={12} sm={4}>
//               <FloatingLabel controlId='CodeTarifAdd' label='Code Tarif' className='mb-3'>
//               <Form.Select
//                     name='Code tarif'
//                     value={selectedProduct?.detail_codeTarif || ''}
//                     onChange={(e) => {
//                       const detail_codeTarif = e.currentTarget.value
//                       setSelectedProduct((prevData: ProductDataType) => ({
//                         ...prevData,
//                         detail_codeTarif: detail_codeTarif,
//                       }))
//                     }}
//                     required
//                   >
//                     <option value=''>Sélectionner un code tarif</option>
//                     {codeTarifTab?.map((codeT: string, index: number) => (
//                       <option key={index} value={codeT}>
//                         {codeT}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   <Form.Control.Feedback type='invalid'>
//                     Sélectionnez un code tarif
//                   </Form.Control.Feedback>
//               </FloatingLabel>
//             </Col>
//             <Col xs={12} sm={4}>
//               <FloatingLabel controlId='CodeSHAdd' label='Code SH' className='mb-3'>
//                 <Form.Control
//                   placeholder='Code SH'
//                   type='text'
//                   value={selectedProduct?.detail_codeSH}
//                   onChange={(e) => {
//                     const codeSH = e.currentTarget.value
//                     setSelectedProduct((prevData: ProductDataType) => ({
//                       ...prevData,
//                       detail_codeSH: codeSH,
//                     }))
//                   }}
//                   required
//                 />
//               </FloatingLabel>
//             </Col>
//             <Col xs={12} sm={4}>
//               <FloatingLabel controlId='Stockage' label='Stockage' className='mb-3'>
//                 <Form.Select
//                   name='stockage'
//                   value={selectedProduct?.detail_stockage}
//                   onChange={(e) => {
//                     const stockage = e.currentTarget.value
//                     setSelectedProduct((prevData: ProductDataType) => ({
//                       ...prevData,
//                       detail_stockage: stockage,
//                     }))
//                   }}
//                   required
//                 >
//                   <option value='' className='text-ui-second'>
//                     Choisir une zone de stockage
//                   </option>
//                   {stockageData?.map((stockage: string, index: number) => (
//                     <option key={index} value={stockage}>
//                       {stockage}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </FloatingLabel>
//             </Col>
//             <Col xs={12} sm={6}>
//               <FloatingLabel controlId='Qté' label='Qté' className='mb-3'>
//                 <Form.Control
//                   placeholder='Qté'
//                   type='number'
//                   value={selectedProduct?.detail_nbColis}
//                   onChange={(e) => {
//                     const qte = parseInt(e.currentTarget.value)
//                     setSelectedProduct((prevData: ProductDataType) => ({
//                       ...prevData,
//                       detail_nbColis: qte,
//                     }))
//                   }}
//                   required
//                 />
//               </FloatingLabel>
//             </Col>
//             <Col xs={12} sm={6}>
//               <FloatingLabel controlId='Poids' label='Poids (Kg)' className='mb-3'>
//                 <Form.Control
//                   placeholder='Poids (Kg)'
//                   type='float'
//                   min={0}
//                   value={selectedProduct?.detail_poids}
//                   onChange={(e) => {
//                     const poids = parseInt(e.currentTarget.value)
//                     setSelectedProduct((prevData: ProductDataType) => ({
//                       ...prevData,
//                       detail_poids: poids,
//                     }))
//                   }}
//                   required
//                 />
//               </FloatingLabel>
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='secondary' onClick={handleCloseAddProductModal}>
//             Annuler
//           </Button>
//           <Button variant='primary' type='submit'>
//             Valider
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//     )
  
//   }

interface UpdateProductModalType {
  selectedProduct: OrderDetailType | undefined
      setSelectedProduct: React.Dispatch<React.SetStateAction<ProductDataType>>
      showUpdateProductModal: boolean
      handleCloseUpdateProductModal: () => void
      validated: boolean
      setValidated: React.Dispatch<React.SetStateAction<boolean>>
      handleSaveProductUpdates: (e: React.FormEvent<HTMLFormElement>) => void
      filteredCodeSh: NomenclatureType[]
      setFilteredCodeSh: React.Dispatch<React.SetStateAction<NomenclatureType[]>>
      isError: errorType

}

  export function UpdateProductModal ({updateProductProps}: {updateProductProps: UpdateProductModalType} ) {
    const {
      selectedProduct,
      setSelectedProduct,
      showUpdateProductModal,
      handleCloseUpdateProductModal,
      validated,
      setValidated,
      handleSaveProductUpdates,
      filteredCodeSh,
      setFilteredCodeSh,
      isError
    } = updateProductProps

    return(
        <Modal
        backdrop='static'
        keyboard={false}
        show={showUpdateProductModal}
        onHide={handleCloseUpdateProductModal}
      >
        <Form noValidate validated={validated} onSubmit={handleSaveProductUpdates}>
          <Modal.Header className='border-bottom-0' closeButton>
            <Modal.Title>
              <i className='ri-pencil-line fs-4 text-primary'></i> Editer une ligne article
            </Modal.Title>
          </Modal.Header>
          <div className='my-2'>
            <Row className='font-85 w-100 gx-0'>
              <Col className='ps-3' xs={3}>
                <b>Code article</b>
              </Col>
              <Col className='text-center'>
                <b>Désignation</b>
              </Col>
              <Col className='text-end pe-3' xs={3}>
                <b>Stockage</b>
              </Col>
            </Row>
            <Row className='font-85 w-100 gx-0 mb-3'>
              <Col className='ps-3' xs={3}>
                {selectedProduct?.detail_referenceExterne}
              </Col>
              <Col className='text-center'>{selectedProduct?.detail_description}</Col>
              <Col className='text-end pe-3' xs={3}>
                {selectedProduct?.detail_stockage}
              </Col>
            </Row>
            <Row className='font-85 w-100 gx-0'>
              <Col className='ps-3' xs={4}>
                <b>Contenant : </b>
                {selectedProduct?.detail_codeTarif}
              </Col>
              <Col className='ps-3' xs={4}>
                <b>Code tarif : </b>
                {selectedProduct?.detail_codeTarif}
              </Col>
              <Col className='text-end pe-3' xs={4}>
                <b>Code SH : </b>
                {selectedProduct?.detail_codeSH}
              </Col>
            </Row>
          </div>
          <Modal.Body>
            <Row>
              <Col xs={12}>
                <FloatingLabel controlId='nbcolis' label='nbcolis' className='mb-3'>
                  <Form.Control
                    name='detail_nbColis'
                    placeholder='nbcolis'
                    type='number'
                    min={0}
                    value={selectedProduct?.detail_nbColis || ''}
                    onChange={(e) => {
                      const qte = parseInt(e.currentTarget.value)
                      setSelectedProduct((prevData: ProductDataType) => ({
                        ...prevData,
                        detail_nbColis: qte,
                      }))
                    }}
                    required
                  />
                  <Form.Control.Feedback type='invalid'>
                    Saisissez le nombre de colis
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col xs={12}>
                <FloatingLabel controlId='Contenant' label='Contenant' className='mb-3'>
                  <Form.Select
                    name='detail_contenant'
                    value={selectedProduct?.detail_contenant || ''}
                    onChange={(e) => {
                      const detail_contenant = e.currentTarget.value
                      setSelectedProduct((prevData: ProductDataType) => ({
                        ...prevData,
                        detail_contenant: detail_contenant,
                      }))
                    }}
                  >
                    <option value=''>Sélectionnez un contenant</option>
                    {contenantTab?.map((contenant: string, index: number) => (
                      <option key={index} value={contenant}>
                        {contenant}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Sélectionnez un contenant
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col xs={12}>
                <FloatingLabel controlId='Poids' label='Poids (Kg)' className='mb-3'>
                  <Form.Control
                    name='detail_poids'
                    placeholder='Poids (Kg)'
                    type='float'
                    min={0}
                    value={selectedProduct?.detail_poids || ''}
                    onChange={(e) => {
                      const poids = parseInt(e.currentTarget.value)
                      setSelectedProduct((prevData: ProductDataType) => ({
                        ...prevData,
                        detail_poids: poids,
                      }))
                    }}
                    required
                  />
                  <Form.Control.Feedback type='invalid'>
                    Saisissez le poids
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col xs={12}>
                <FloatingLabel controlId='Stockage' label='Stockage' className='mb-3'>
                  <Form.Select
                    name='detail_stockage'
                    value={selectedProduct?.detail_stockage || ''}
                    onChange={(e) => {
                      const detail_stockage = e.currentTarget.value
                      setSelectedProduct((prevData: ProductDataType) => ({
                        ...prevData,
                        detail_stockage: detail_stockage,
                      }))
                    }}
                    required
                  >
                    <option value=''>Sélectionner une zone de stockage</option>
                    {stockageData?.map((stockage: string, index: number) => (
                      <option key={index} value={stockage}>
                        {stockage}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Sélectionnez une zone de stockage
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col xs={12}>
                <FloatingLabel controlId='Code Tarif' label='Code Tarif' className='mb-3'>
                  <Form.Select
                    name='Code tarif'
                    value={selectedProduct?.detail_codeTarif || ''}
                    onChange={(e) => {
                      const detail_codeTarif = e.currentTarget.value
                      setSelectedProduct((prevData: ProductDataType) => ({
                        ...prevData,
                        detail_codeTarif: detail_codeTarif,
                      }))
                    }}
                    required
                  >
                    <option value=''>Sélectionner un code tarif</option>
                    {codeTarifTab?.map((codeT: string, index: number) => (
                      <option key={index} value={codeT}>
                        {codeT}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    Sélectionnez un code tarif
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col xs={12} sm={12}>
                <FloatingLabel controlId='Code SH' label='Code SH' className='mb-3'>
                  <Form.Control
                    name='codeSH'
                    type='text'
                    autoComplete='on'
                    placeholder='Saisissez un Code SH'
                    value={selectedProduct?.detail_codeSH || ''}
                    onChange={(e) => {
                      const detail_codeSH = e.target.value
                      setSelectedProduct((prevData: ProductDataType) => ({
                        ...prevData,
                        detail_codeSH: detail_codeSH,
                      }))
                    }}
                    required
                  />
                  {filteredCodeSh?.length > 0 && (
                    <ListGroup>
                      {filteredCodeSh?.map(
                        (sh: NomenclatureType, index: number) => (
                          <ListGroup.Item
                            action
                            variant='primary'
                            key={index}
                            onClick={() => {
                              const detail_codeSH = `${sh?.nomenclature}`
                              setSelectedProduct((prevData: ProductDataType) => ({
                                ...prevData,
                                detail_codeSH: detail_codeSH,
                              }))
                              setFilteredCodeSh([])
                            }}
                          >
                            {' '}
                            {sh?.nomenclature} : {sh?.libelle}
                          </ListGroup.Item>
                        )
                      )}
                    </ListGroup>
                  )}
                </FloatingLabel>
              </Col>
            </Row>
            <Alert
              show={isError?.error}
              variant='danger'
              className='d-flex align-items-center mt-3'
            >
              <i className='ri-error-warning-line fs-4 text-danger me-2'></i> {isError.message}
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => {
                handleCloseUpdateProductModal()
                setValidated(true)
                setFilteredCodeSh([])
              }}
            >
              Annuler
            </Button>
            <Button variant='primary' type='submit'>
              Valider
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }