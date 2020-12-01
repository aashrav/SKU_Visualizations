from app import app
from flask import render_template, request, redirect, make_response, jsonify, abort
from .models import User, Corporate, File, MasterFile
from bson import ObjectId
import pandas as pd
import csv
import mongoengine
from flask_cors import CORS
from .graphFunctions import *
from flask import Flask

@app.route('/')
def index():
    # print(User.objects)
  return app.send_static_file('index.html')


@app.route('/addUser', methods = ['POST'])
def addUser():
    email = request.form.get('email')
    if(not email): 
      return 'Invalid request, user cannot be created without email'
    name = request.form.get('name', default = '')
    password = request.form.get('password')
    corporate_id = request.form.get('corporate_id')
    print(request.form)
    newUser = User(email = email, name = name, password = password, corporate_id= ObjectId(corporate_id))
    newUser.save()
    return redirect('/')

@app.route('/uploadFile', methods = ['POST'])
def uploadFile():
  uploadedFile = request.files.get('file')
  print(uploadedFile)
  corporateName = request.form.get('corporateName')
  newFile = File()
  newFile.file_.put(uploadedFile, filename = uploadedFile.filename, content_type = "multipart/form-data")
  findId = Corporate.objects(corporate_name = corporateName).get()
  

  if(len(findId) == 0):
    corporate = Corporate(corporate_id = corporateId, uploadedFiles = [newFile])
    corporate.save()
  else:
    findId.uploadedFiles.append(newFile)
    findId.save()  
  return redirect('/')

def getFiles(name = 'Microsoft'):
   files = Corporate.objects.get(corporate_name = name).uploadedFiles
   return files

def getFileId(id):
   files = mongoengine.GridFSProxy(id)
   return files

@app.route('/download/<string:id>')
def downloadFile(id):
  file_obj = mongoengine.GridFSProxy(ObjectId(id))
  response = make_response(file_obj.read())
  response.headers['Content-Type'] = 'application/octet-stream'
  response.headers["Content-Disposition"] = "attachment; filename={}".format(file_obj.filename)
  return response

@app.route('/createMaster', methods = ['POST'])
def createMaster():
  uploadedFile = request.files.get('file')
  corporateName = request.form.get('corporateName')
  file1 = request.form.get('file1')
  file2 = request.form.get('file2')

  master = MasterFile(file_composition = [ObjectId(file1), ObjectId(file2)])
  master.file.put(uploadedFile, filename = uploadedFile.filename, content_type = "multipart/form-data")
  
  corporation = Corporate.objects.get(corporate_name = corporateName)
  corporation.masterFiles.append(master)

  corporation.save()
 
  return redirect('/')

@app.route('/getColumns', methods = ['POST'])
def getColumns():
  req = request.get_json()
  if(not req or ('file' not in req) or (len(req.get("file")) < 24)):
    #Bad Request
    return abort(400, 'Invalid Request')

  file = req.get("file")
  file_obj = mongoengine.GridFSProxy(ObjectId(file))
  
  if(not file_obj or file_obj.length == 0):
    #Bad Request
    return abort(400, 'Invalid file')

  df = pd.read_csv(file_obj)
  return jsonify(df.columns.tolist())

@app.route('/getDataFromColumn', methods = ['POST'])
def getDataFromColumn():
  
  req = request.get_json()
  if(not req or ('file' not in req) or ('columnName' not in req) or (len(req.get("file")) < 24)):
    #Bad Request
    return abort(400, 'Invalid Request')


  file = req.get('file')
  column_name = req.get('columnName')
  file_obj = mongoengine.GridFSProxy(ObjectId(file))

  if(not file_obj or file_obj.length == 0):
    #Bad Request
    return abort(400, 'Invalid file')

  df = pd.read_csv(file_obj)
  column = df.get(column_name)

  if(column is None or column.empty):
    #Bad Request
    return abort(400, 'Invalid Column')
    
  return jsonify(column.tolist())

@app.route('/getDataFromFile', methods = ['POST'])
def getDataFromFile():
  
  req = request.get_json()
  if(not req or ('file' not in req) or (len(req.get("file")) < 24)):
    #Bad Request
    return abort(400, 'Invalid Request')


  file = req.get('file')
  file_obj = mongoengine.GridFSProxy(ObjectId(file))

  if(not file_obj or file_obj.length == 0):
    #Bad Request
    return abort(400, 'Invalid file')

  df = pd.read_csv(file_obj)
  return(jsonify(df.values.tolist()))


@app.route('/getScatterGraphData', methods = ['POST'])
def getScatterGraphData():
  req = request.get_json()

  if(not req or ('file' not in req) or ('columnX' not in req)  or ('columnY' not in req) or (len(req.get("file")) < 24)):
    #Bad Request
    return abort(400, 'Invalid Request')

  
  file = req.get('file')
  file_obj = mongoengine.GridFSProxy(ObjectId(file))

  if(not file_obj or file_obj.length == 0):
    #Bad Request
    return abort(400, 'Invalid file')

  
  df = pd.read_csv(file_obj)
  # print(linear_extrapolation_data_output(df, req.get('columnX'), req.get('columnY')))
  return jsonify(linear_extrapolation_data_output(df, req.get('columnX'), req.get('columnY')))



@app.route('/getLineGraphData', methods = ['POST'])
def getLineGraphData():
  req = request.get_json()

  if(not req or ('file' not in req) or ('columnX' not in req)  or ('columnY' not in req) or (len(req.get("file")) < 24)):
    #Bad Request
    return abort(400, 'Invalid Request')

  
  file = req.get('file')
  file_obj = mongoengine.GridFSProxy(ObjectId(file))

  if(not file_obj or file_obj.length == 0):
    #Bad Request
    return abort(400, 'Invalid file')

  
  df = pd.read_csv(file_obj)
  # print(linear_extrapolation_data_output(df, req.get('columnX'), req.get('columnY')))
  columnX = req.get('columnX')
  columnY = req.get('columnY')
  prediction = time_series_linear_regression_data_outputs(df, columnX, columnY)
  actual = time_series_data_outputs(df, columnX, columnY)

  return jsonify(actual + prediction)

@app.route('/getTable', methods=['POST'])
def getTable():

    req = request.get_json()
    if(not req or ('file' not in req) or (len(req.get("file")) < 24)):
      #Bad Request
      return abort(400, 'Invalid Request')


    file = req.get('file')
    file_obj = mongoengine.GridFSProxy(ObjectId(file))
    df = pd.read_csv(file_obj)
    df = df.where(pd.notnull(df), None)

    headers, rows = decompose_df(df)
    # print(headers)
    # return jsonify(headers)
  
    return jsonify({'headers': headers,'rows':rows})

@app.route('/filterTable', methods=['POST'])
def filterTable():
    req = request.get_json()
    if(not req or ('file' not in req) or (len(req.get("file")) < 24)):
      #Bad Request
      return abort(400, 'Invalid Request')

    file = req.get('file')
    file_obj = mongoengine.GridFSProxy(ObjectId(file))
    df = pd.read_csv(file_obj)
    
    filtered = table_filter(df, req['ops'], req['column'], int(req['val']))
    headers, rows = decompose_df(filtered.where(pd.notnull(df), None))
    return make_response(jsonify({'headers' : headers, 'rows' : rows}), 200)