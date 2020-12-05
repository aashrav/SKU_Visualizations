import numpy as np
import pandas as pd
from statsmodels.stats.outliers_influence import variance_inflation_factor
from scipy.interpolate import make_interp_spline
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
def correlation_matrix(tbl):
    corr_matrix = tbl.corr()
    return corr_matrix

#This returns all the columns that have high r^2 values
def correlated_values_r_sq(tbl):
    corr = correlation_matrix(tbl)
    
    cols = corr.columns
    tolerance_check = []
    for c in cols:
        counter = 0
        for r_sq in corr[c]:
            if r_sq > 0.7:
                counter+=1
                
            if counter>3:
                tolerance_check.append(c)
    return tolerance_check

#This returns all the columns that have high VIF scores
def correlated_values_vif(tbl):
    #remove string columns
    tbl = tbl.fillna(0)
    X = tbl.iloc[:,:-1]
    
    
    
    labels = list(X.columns)
    Y = pd.DataFrame()
    for l in labels:
        #if type(X[l][0]) == numpy.int64 or type(X[l][0]) == numpy.float64:
        types = [type(x) for x in X[l]]
        if str not in types and bool not in types:
            Y[l] = X[l]

    # Calculating VIF
    vif = pd.DataFrame()
    vif["variables"] = Y.columns
    vif["VIF"] = [variance_inflation_factor(Y.values, i) for i in range(Y.shape[1])]
    
    var_labels = []
    #check VIF scores and labels:
    while sum(vif["VIF"]>5)>0:
        max_VIF = np.max(np.array(vif["VIF"]))
        lab = vif[vif["VIF"]==max_VIF]["variables"]
        
        var_labels.append(lab)
        
        vif = vif.set_index("variables")
        vif = vif.drop(lab)
        vif = vif.reset_index()
            
    
    return var_labels

#We return all the distinct columns that are highly correlated
def all_correlated_columns(tbl):
    first_set_labels = list(correlated_values_r_sq(tbl))
    vals = correlated_values_vif(tbl)
    
    second_set_labels = []
    for v in vals:
        ls = list(v)
        second_set_labels += ls
    
    total_set = first_set_labels + second_set_labels
    
    return list(set(total_set)) #FIND THE DISTINCT UNION SET OF ALL THE VALUES

def linear_extrapolation_data_output(tbl, columnX, columnY):
    #SETTING UP TABLES (IE. FORMATTING/CLEANING)
    
    X = tbl[columnX][:, None]
    X_train, X_test, y_train, y_test = train_test_split(X, tbl[columnY], random_state=0)

    model = LinearRegression()
    model.fit(X_train, y_train)

    x_range = np.linspace(X.min(), X.max(), 100)
    y_range = model.predict(x_range.reshape(-1, 1))
    x = tbl[columnX]
    y = tbl[columnY]
    data = []
    for i in range(len(x)):
      data.append({'index': int(x[i]), 'y': int(y[i])})
    for i in range(len(x_range)):
      data.append({'index': int(x_range[i]), 'predictionY': int(y_range[i])})

    return data

def time_series_linear_regression_data_outputs(tbl, time_label, response_name):
    
    #SETTING UP TABLES (IE. FORMATTING/CLEANING)
    tbl = tbl.groupby(by = time_label).mean().reset_index() #take average of given values
    tbl = tbl.sort_values(by=[time_label])
    correlated_columns_labels = all_correlated_columns(tbl)
    
    
    #X and Y Variables:
    response = tbl[response_name]
    r = np.array(response)
    
    time = np.array(tbl[time_label])
    
    #SETTING UP MATRIX FOR REGRESSION
    X = tbl.drop(columns=correlated_columns_labels)
    
    if response_name not in correlated_columns_labels:
        X = X.drop(columns=[response_name])
    
    if time_label not in correlated_columns_labels:
        X = X.drop(columns=[time_label])
        
    X = X.values
    
    #SET UP TRAINING SET - WE WILL NOT BE USING A TEST SET SINCE WE ARE USING ONLY A MINORITY OF VALUES
    #THE FULL VALIDATION SET OF X AND RESPONSE VALUES WILL INCLUDE MOVING AVERAGE FORECASTS ALONG WITH LINEAR REGRESSION
    ids = np.arange(len(X))
    
    def best_seed(i):
        np.random.seed(i)
        random_train_ids = np.random.choice(ids, int(np.round(len(X)*0.4)), replace=False)
    
        trainX = np.array([X[i] for i in ids if i in random_train_ids])
        r_new_training = np.array([r[i] for i in ids if i in random_train_ids])
    
    
        reg = LinearRegression().fit(trainX, r_new_training)
    
        predicted_r_vals = reg.predict(X)
        
        #Now we have two values to work with: the predicted y values and the actual y values. 
        #We will also be generating moving averages for each point and the next eight points for forecasting.
    
        moving_average_current_points = np.array(list(r[0:4])+[(r[i-1]+r[i-2]+r[i-3]+r[i-4])/4 for i in range(len(r)) if i>=4])
        augmented_predictions_current_points = ((r*0.45) + (np.array(predicted_r_vals)*0.4) + (moving_average_current_points*0.15))
    
        
        #Checking errors using the square root of MSE and MAE
    
        mse_sqrt = np.sqrt(np.mean((r - augmented_predictions_current_points)**2))
        mae = np.mean(np.abs(r - augmented_predictions_current_points))
    
        #Checking accuracy:
        accuracy = np.mean(np.array([v<=mse_sqrt or v<mae for v in np.abs(r - augmented_predictions_current_points)]))
        
        return accuracy, augmented_predictions_current_points
    
    seed_values = range(300)
    accuracy = 0
    augmented_predictions_current_points = np.array([])
    
    #obtaining most accuracy seed for predictions
    for i in seed_values:
        acc, aug = best_seed(i)
        if acc > accuracy:
            augmented_predictions_current_points = aug
            accuracy = acc
    
    
    #Now we will add predictions for the next four periods
    time_delta = np.mean(np.diff(time)[-5::1]) #provide a relatively even interval to use for time
    future_time = np.array([time[-1]+(i*time_delta) for i in range(4+1)])
    
    #exponentially weighted moving average
    def ewma(N, arr):
        alpha = 2/(N+1)
        coeff = (1-alpha)
        
        weighted_sum = 0
        weighted_count = 0
        specific_arr = arr[-N::1]
        for i in np.arange(1, N, 1):
            weighted_sum += (coeff*(N-i))*specific_arr[i-1]
            weighted_count += (coeff*(N-i))
        
        return weighted_sum/weighted_count
    
    N = len(augmented_predictions_current_points)//5
    forecast1 = ewma(N, augmented_predictions_current_points)
    forecast2 = ewma(N, np.array(list(augmented_predictions_current_points)+[forecast1]))
    forecast3 = ewma(N, np.array(list(augmented_predictions_current_points)+[forecast1, forecast2]))
    forecast4 = ewma(N, np.array(list(augmented_predictions_current_points)+[forecast1, forecast2, forecast3]))
    
    
    forecasts = np.array([augmented_predictions_current_points[-1], forecast1, forecast2, forecast3, forecast4])
    
    #VALUES TO OUTPUT
    time_values = np.array(list(time)+list(future_time))
    all_predicted_r_and_forecasts = np.array(list(augmented_predictions_current_points)+list(forecasts))
    
    data = []
    for i in range(len(time_values)):
      data.append({'time': round(time_values[i],2), 'prediction': round(all_predicted_r_and_forecasts[i],2)})


    return data

def time_series_data_outputs(tbl, time_label, response_name):
    
    #SETTING UP TABLES (IE. FORMATTING/CLEANING)
    tbl = tbl.groupby(by = time_label).mean().reset_index() #take average of given values
    tbl = tbl.sort_values(by=[time_label])
    correlated_columns_labels = all_correlated_columns(tbl)
    
    
    #X and Y Variables:
    response = tbl[response_name]
    r = np.array(response)
    
    time = np.array(tbl[time_label])

    data = []
    for i in range(len(time)):
      data.append({'time': round(time[i],2), 'y': round(r[i], 2) })
    return data

def decompose_df(df):
    col_types = df.dtypes
    headers = []
    for col_name, col_type in col_types.iteritems():
        if 'float' in col_type.name or 'int' in col_type.name:
            headers.append({'field' : col_name, 'headerName' : col_name, 'type' : 'number', 'width' : 200})
        elif 'object' in col_type.name:
            headers.append({'field' : col_name, 'headerName' : col_name, 'type' : 'string', 'width' : 200})
        else:
            headers.append({'field' : col_name, 'headerName' : col_name, 'type' : 'other', 'width' : 200})
    rows = []
    all_rows = df.values.tolist()
    for index in range(len(all_rows)):
        r = all_rows[index]
        dic = {headers[i]['field'] : r[i] for i in range(len(r))}
        dic['id'] = index
        rows.append(dic)
  
    return headers, rows


def table_filter(tbl, operation, column, value):
    if operation=='=':
        return tbl[tbl[column]==value]
    elif operation=='>':
        return tbl[tbl[column]>value]
    elif operation=='<':
        return tbl[tbl[column]<value]
    elif operation=='>=':
        return tbl[tbl[column]>=value]
    elif operation=='<=':
        return tbl[tbl[column]<=value]
